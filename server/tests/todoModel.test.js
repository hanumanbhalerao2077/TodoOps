const Todo = require("../models/todoModel");
const { connect, closeDatabase, clearDatabase } = require("./test-db");

describe("Todo Model", () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe("Todo Schema Validation", () => {
    it("should create a todo with valid data", async () => {
      const todoData = { task: "Test todo" };
      const todo = new Todo(todoData);
      const savedTodo = await todo.save();

      expect(savedTodo._id).toBeDefined();
      expect(savedTodo.task).toBe("Test todo");
      expect(savedTodo.isCompleted).toBe(false);
      expect(savedTodo.createdAt).toBeDefined();
      expect(savedTodo.updatedAt).toBeDefined();
    });

    it("should fail to create todo without task", async () => {
      const todo = new Todo({});
      let error;

      try {
        await todo.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe("ValidationError");
    });

    it("should set default isCompleted to false", async () => {
      const todoData = { task: "Another test" };
      const todo = new Todo(todoData);
      const savedTodo = await todo.save();

      expect(savedTodo.isCompleted).toBe(false);
    });

    it("should allow updating isCompleted", async () => {
      const todoData = { task: "Complete me", isCompleted: true };
      const todo = new Todo(todoData);
      const savedTodo = await todo.save();

      expect(savedTodo.isCompleted).toBe(true);
    });
  });

  describe("Todo Model Methods", () => {
    it("should find all todos", async () => {
      await Todo.create([
        { task: "Task 1" },
        { task: "Task 2" },
        { task: "Task 3" }
      ]);

      const todos = await Todo.find();
      expect(todos.length).toBe(3);
    });

    it("should find todo by id", async () => {
      const todo = await Todo.create({ task: "Find me" });
      const foundTodo = await Todo.findById(todo._id);

      expect(foundTodo.task).toBe("Find me");
      expect(foundTodo._id.toString()).toBe(todo._id.toString());
    });

    it("should update todo by id", async () => {
      const todo = await Todo.create({ task: "Update me" });
      const updatedTodo = await Todo.findByIdAndUpdate(
        todo._id,
        { task: "Updated", isCompleted: true },
        { new: true }
      );

      expect(updatedTodo.task).toBe("Updated");
      expect(updatedTodo.isCompleted).toBe(true);
    });

    it("should delete todo by id", async () => {
      const todo = await Todo.create({ task: "Delete me" });
      const deletedTodo = await Todo.findByIdAndDelete(todo._id);

      expect(deletedTodo.task).toBe("Delete me");

      const foundTodo = await Todo.findById(todo._id);
      expect(foundTodo).toBeNull();
    });
  });
});