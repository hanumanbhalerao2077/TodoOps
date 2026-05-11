// Setup file for Jest tests
const mongoose = require("mongoose");

// Set test environment
process.env.NODE_ENV = "test";
process.env.MONGODB_ATLAS_CONNECTION = "mongodb://localhost:27017/test";

// Increase timeout for database operations
jest.setTimeout(10000);

// Clean up after each test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Clean up after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});