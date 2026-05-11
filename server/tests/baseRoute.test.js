const request = require("supertest");
const app = require("../index");

describe("Base Route", () => {
  it("should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Welcome to MERN-Todofy!");
    expect(response.text).toContain("https://mern-todofy.netlify.app");
  });
});