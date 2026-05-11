const request = require("supertest");
const app = require("../index"); // Import your Express app
const { connect, closeDatabase, clearDatabase } = require("./test-db");

let server;

beforeAll(async () => {
  await connect();
  server = app.listen(5001); // Use a different port for testing
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  server.close();
  await closeDatabase();
});

describe("Todo API", () => {
  describe("GET /api/get", () => {
    it("should return empty array when no todos exist", async () => {
      const response = await request(app).get("/api/get");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all todos", async () => {
      // First create a todo
      await request(app)
        .post("/api/new")
        .send({ task: "Test todo" });

      const response = await request(app).get("/api/get");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("task", "Test todo");
      expect(response.body[0]).toHaveProperty("isCompleted", false);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("createdAt");
      expect(response.body[0]).toHaveProperty("updatedAt");
    });
  });

  describe("POST /api/new", () => {
    it("should create a new todo successfully", async () => {
      const response = await request(app)
        .post("/api/new")
        .send({ task: "Learn testing" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Task created successfully.");
      expect(response.body.newList).toHaveProperty("task", "Learn testing");
      expect(response.body.newList).toHaveProperty("isCompleted", false);
    });

    it("should return 400 for invalid task", async () => {
      const response = await request(app)
        .post("/api/new")
        .send({ task: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorMessage", "Task is not valid.");
    });

    it("should return 400 for missing task field", async () => {
      const response = await request(app)
        .post("/api/new")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorMessage", "Task is not valid.");
    });

    it("should return 400 for non-string task", async () => {
      const response = await request(app)
        .post("/api/new")
        .send({ task: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorMessage", "Task is not valid.");
    });
  });

  describe("PUT /api/update/:id", () => {
    let todoId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/new")
        .send({ task: "Update me" });
      todoId = response.body.newList._id;
    });

    it("should update todo successfully", async () => {
      const response = await request(app)
        .put(`/api/update/${todoId}`)
        .send({ task: "Updated task", isCompleted: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Task updated successfully.");
      expect(response.body.updatedTask).toHaveProperty("task", "Updated task");
      expect(response.body.updatedTask).toHaveProperty("isCompleted", true);
    });

    it("should return 404 for non-existent todo", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .put(`/api/update/${fakeId}`)
        .send({ task: "This won't work" });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorMessage", "Task not found.");
    });
  });

  describe("DELETE /api/delete/:id", () => {
    let todoId;

    beforeEach(async () => {
      const response = await request(app)
        .post("/api/new")
        .send({ task: "Delete me" });
      todoId = response.body.newList._id;
    });

    it("should delete todo successfully", async () => {
      const response = await request(app)
        .delete(`/api/delete/${todoId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Task deleted successfully.");
      expect(response.body.deleted).toHaveProperty("_id", todoId);
    });

    it("should return 404 for non-existent todo", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .delete(`/api/delete/${fakeId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorMessage", "Task not found.");
    });
  });
});