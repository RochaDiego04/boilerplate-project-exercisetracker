import request from "supertest";
import { jest } from "@jest/globals";
import { createApp } from "../../app";
import { UserModel } from "../../models/User";
import { ExerciseModel } from "../../models/Exercise";

const mockUserModel = {
  create: jest.fn(),
  getAll: jest.fn(),
  getById: jest.fn(),
} as unknown as jest.Mocked<UserModel>;

const mockExerciseModel = {
  create: jest.fn(),
  findByUserId: jest.fn(),
};

describe("User Routes", () => {
  const app = createApp(
    mockUserModel as unknown as UserModel,
    mockExerciseModel as unknown as ExerciseModel
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/v1/users - creates user", async () => {
    mockUserModel.create.mockResolvedValue({
      id: 1,
      username: "testuser",
    });

    const response = await request(app)
      .post("/api/v1/users")
      .send({ username: "testuser" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      username: "testuser",
    });
    expect(mockUserModel.create).toHaveBeenCalledWith("testuser");
  });
});
