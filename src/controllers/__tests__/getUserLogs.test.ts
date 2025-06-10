import { Request, Response } from "express";
import { setupControllerTest, mockUser, mockExercise } from "./testHelpers";

describe("getUserLogs", () => {
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
    mockReq.user = mockUser;

    jest.clearAllMocks();
    mockExerciseModel.findByUserId.mockResolvedValue([mockExercise]);
    mockExerciseModel.countByUserId.mockResolvedValue(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return user logs with count", async () => {
    await controller.getUserLogs(mockReq as Request, mockRes as Response);

    expect(mockExerciseModel.countByUserId).toHaveBeenCalledWith(1, {});
    expect(mockExerciseModel.findByUserId).toHaveBeenCalledWith(1, {});
    expect(resJson).toHaveBeenCalledWith({
      id: 1,
      username: "testuser",
      count: 1,
      logs: [mockExercise],
    });
  });

  it("should handle date filters and count", async () => {
    mockReq.query = { from: "2023-01-01", to: "2023-01-31" };

    mockExerciseModel.countByUserId.mockResolvedValue(5);

    await controller.getUserLogs(mockReq as Request, mockRes as Response);

    expect(mockExerciseModel.countByUserId).toHaveBeenCalledWith(1, {
      from: "2023-01-01",
      to: "2023-01-31",
    });
    expect(mockExerciseModel.findByUserId).toHaveBeenCalledWith(1, {
      from: "2023-01-01",
      to: "2023-01-31",
      limit: undefined,
    });
    expect(resJson).toHaveBeenCalledWith({
      id: 1,
      username: "testuser",
      count: 5,
      logs: [mockExercise],
    });
  });

  it("should handle limit and return correct count", async () => {
    mockReq.query = { limit: "2" };

    mockExerciseModel.countByUserId.mockResolvedValue(10);
    mockExerciseModel.findByUserId.mockResolvedValue([
      { ...mockExercise, id: 1 },
      { ...mockExercise, id: 2 },
    ]);

    await controller.getUserLogs(mockReq as Request, mockRes as Response);

    expect(mockExerciseModel.countByUserId).toHaveBeenCalledWith(1, {});
    expect(mockExerciseModel.findByUserId).toHaveBeenCalledWith(1, {
      limit: 2,
    });
    expect(resJson).toHaveBeenCalledWith({
      id: 1,
      username: "testuser",
      count: 10,
      logs: [
        { ...mockExercise, id: 1 },
        { ...mockExercise, id: 2 },
      ],
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
