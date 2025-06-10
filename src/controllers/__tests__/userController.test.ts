import { CreatedExerciseResponse, Exercise } from "../../interfaces/Exercise";
import { User } from "../../interfaces/User";
import { ExerciseModel } from "../../models/Exercise";
import { UserModel } from "../../models/User";
import { createUserController } from "../userController";
import { Request, Response } from "express";

const mockUser: User = { id: 1, username: "testuser" };
const mockExercise: Exercise = {
  id: 1,
  description: "Test exercise",
  duration: 30,
  date: "2023-01-01T00:00:00.000Z",
};

const mockResolvedExercise: CreatedExerciseResponse = {
  userId: 1,
  exerciseId: 1,
  description: "Test exercise",
  duration: 30,
  date: "2020-02-29T00:00:00.000Z",
};

describe("User Controller", () => {
  let mockUserModel: jest.Mocked<UserModel>;
  let mockExerciseModel: jest.Mocked<ExerciseModel>;
  let controller: ReturnType<typeof createUserController>;

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let resJson: jest.Mock;
  let resStatus: jest.Mock;

  beforeEach(() => {
    mockUserModel = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
    } as unknown as jest.Mocked<UserModel>;

    mockExerciseModel = {
      create: jest.fn(),
      findByUserId: jest.fn(),
    } as unknown as jest.Mocked<ExerciseModel>;

    controller = createUserController(mockUserModel, mockExerciseModel);

    resJson = jest.fn();
    resStatus = jest.fn(() => ({ json: resJson }));
    mockRes = {
      status: resStatus as unknown as Response["status"],
      json: resJson as unknown as Response["json"],
    };

    mockReq = {
      body: {},
      query: {},
      user: mockUser,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const users = [mockUser];
      mockUserModel.getAll.mockResolvedValue(users);

      await controller.getAllUsers(mockReq as Request, mockRes as Response);

      expect(mockUserModel.getAll).toHaveBeenCalled();
      expect(resJson).toHaveBeenCalledWith(users);
    });

    it("should handle errors", async () => {
      mockUserModel.getAll.mockRejectedValue(new Error("DB error"));
      await controller.getAllUsers(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(500);
      expect(resJson).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      mockReq.body.username = "newUser";
      mockUserModel.create.mockResolvedValue(mockUser);

      await controller.createUser(mockReq as Request, mockRes as Response);

      expect(mockUserModel.create).toHaveBeenCalledWith("newUser");
      expect(resJson).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 when username is missing", async () => {
      mockReq.body = {};
      await controller.createUser(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({ error: "Username is required" });
    });

    it("should handle duplicate username error", async () => {
      mockReq.body.username = "testuser";
      const error = new Error("UNIQUE constraint failed");
      mockUserModel.create.mockRejectedValue(error);
      await controller.createUser(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "Username already exists",
      });
    });
  });

  describe("getUserLogs", () => {
    beforeEach(() => {
      mockReq.params = { _id: "1" };
      mockReq.user = mockUser;
    });

    it("should return user logs", async () => {
      const exercises = [mockExercise];
      mockExerciseModel.findByUserId.mockResolvedValue(exercises);

      await controller.getUserLogs(mockReq as Request, mockRes as Response);

      expect(mockExerciseModel.findByUserId).toHaveBeenCalledWith(1, {});
      expect(resJson).toHaveBeenCalledWith({
        id: 1,
        username: "testuser",
        count: 1,
        logs: exercises,
      });
    });

    it("should handle date filters", async () => {
      mockReq.query = { from: "2023-01-01", to: "2023-01-31" };
      const exercises = [mockExercise];
      mockExerciseModel.findByUserId.mockResolvedValue(exercises);

      await controller.getUserLogs(mockReq as Request, mockRes as Response);

      expect(mockExerciseModel.findByUserId).toHaveBeenCalledWith(1, {
        from: "2023-01-01",
        to: "2023-01-31",
        limit: undefined,
      });
      expect(resJson).toHaveBeenCalledWith({
        id: 1,
        username: "testuser",
        count: 1,
        logs: exercises,
      });
    });

    it("should return 400 for invalid date format", async () => {
      mockReq.query = { from: "invalid-date" };
      await controller.getUserLogs(mockReq as Request, mockRes as Response);
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "Invalid 'from' date format. Use yyyy-mm-dd",
      });
    });

    it("should return 400 for invalid to date", async () => {
      mockReq.query = { to: "invalid-date" };
      await controller.getUserLogs(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "Invalid 'to' date format. Use yyyy-mm-dd",
      });
    });

    it("should handle missing user ID", async () => {
      mockReq.user = undefined;
      await controller.getUserLogs(mockReq as Request, mockRes as Response);

      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({ error: "User ID missing" });
    });

    it("should handle invalid limit", async () => {
      mockReq.query = { limit: "invalid" };
      await controller.getUserLogs(mockReq as Request, mockRes as Response);
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({ error: "Invalid limit value" });
    });
  });

  describe("createExercise", () => {
    beforeEach(() => {
      mockReq.params = { _id: "1" };
      mockReq.body = {
        description: "Test exercise",
        duration: 30,
      };
      mockReq.user = mockUser;
    });

    it("should create a new exercise", async () => {
      const resolvedExercise = mockResolvedExercise;
      mockReq.body.date = "2020-02-29";
      mockExerciseModel.create.mockResolvedValue(resolvedExercise);
      await controller.createExercise(mockReq as Request, mockRes as Response);
      expect(mockExerciseModel.create).toHaveBeenCalledWith(
        1,
        "Test exercise",
        30,
        "2020-02-29T00:00:00.000Z"
      );
      expect(resJson).toHaveBeenCalledWith(resolvedExercise);
    });

    it("should return 400 when description is missing", async () => {
      mockReq.body.description = undefined;
      const error = new Error("Description and duration are required");
      mockExerciseModel.create.mockRejectedValue(error);
      await controller.createExercise(mockReq as Request, mockRes as Response);
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "Description and duration are required",
      });
    });

    it("should return 400 if user ID is missing", async () => {
      mockReq.user = undefined;
      const error = new Error("User ID missing");
      mockExerciseModel.create.mockRejectedValue(error);
      await controller.createExercise(mockReq as Request, mockRes as Response);
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "User ID missing",
      });
    });

    it("should handle invalid date format", async () => {
      mockReq.body.date = "invalid-date";
      const error = new Error("Invalid date format. Use yyyy-mm-dd");
      mockExerciseModel.create.mockRejectedValue(error);
      await controller.createExercise(mockReq as Request, mockRes as Response);
      expect(resStatus).toHaveBeenCalledWith(400);
      expect(resJson).toHaveBeenCalledWith({
        error: "Invalid date format. Use yyyy-mm-dd",
      });
    });
  });
});
