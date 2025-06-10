import { Request, Response } from "express";
import { setupControllerTest, mockUser } from "./testHelpers";

describe("createUser", () => {
  const { mockUserModel, controller, mockReq, mockRes, resJson, resStatus } =
    setupControllerTest();

  afterEach(() => {
    jest.clearAllMocks();
  });

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
