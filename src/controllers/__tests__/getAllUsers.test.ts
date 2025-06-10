import { Request, Response } from "express";
import { setupControllerTest, mockUser } from "./testHelpers";

describe("getAllUsers", () => {
  const { mockUserModel, controller, mockReq, mockRes, resJson, resStatus } =
    setupControllerTest();

  afterEach(() => {
    jest.clearAllMocks();
  });

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
