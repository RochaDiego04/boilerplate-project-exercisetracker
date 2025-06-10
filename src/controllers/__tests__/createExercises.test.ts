import { Request, Response } from "express";
import {
  setupControllerTest,
  mockResolvedExercise,
  mockUser,
} from "./testHelpers";

describe("createExercise", () => {
  const {
    mockExerciseModel,
    controller,
    mockReq,
    mockRes,
    resJson,
    resStatus,
  } = setupControllerTest();

  beforeEach(() => {
    mockReq.params = { _id: "1" };
    mockReq.body = {
      description: "Test exercise",
      duration: 30,
    };
    mockReq.user = mockUser;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new exercise", async () => {
    mockReq.body.date = "2020-02-29";
    mockExerciseModel.create.mockResolvedValue(mockResolvedExercise);

    await controller.createExercise(mockReq as Request, mockRes as Response);

    expect(mockExerciseModel.create).toHaveBeenCalledWith(
      1,
      "Test exercise",
      30,
      "2020-02-29T00:00:00.000Z"
    );
    expect(resJson).toHaveBeenCalledWith(mockResolvedExercise);
  });

  it("should return 400 when description is missing", async () => {
    mockReq.body.description = undefined;
    const error = new Error("Description is required");
    mockExerciseModel.create.mockRejectedValue(error);
    await controller.createExercise(mockReq as Request, mockRes as Response);
    expect(resStatus).toHaveBeenCalledWith(400);
    expect(resJson).toHaveBeenCalledWith({
      error: "Description is required",
    });
  });

  it("should return 400 when duration is missing", async () => {
    mockReq.body.duration = undefined;
    const error = new Error("Duration is required");
    mockExerciseModel.create.mockRejectedValue(error);
    await controller.createExercise(mockReq as Request, mockRes as Response);
    expect(resStatus).toHaveBeenCalledWith(400);
    expect(resJson).toHaveBeenCalledWith({
      error: "Duration is required",
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
