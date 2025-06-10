import { Request, Response } from "express";
import { User } from "../../interfaces/User";
import { CreatedExerciseResponse, Exercise } from "../../interfaces/Exercise";
import { UserModel } from "../../models/User";
import { ExerciseModel } from "../../models/Exercise";
import { createUserController } from "../userController";

export const mockUser: User = { id: 1, username: "testuser" };
export const mockExercise: Exercise = {
  id: 1,
  description: "Test exercise",
  duration: 30,
  date: "2023-01-01T00:00:00.000Z",
};
export const mockResolvedExercise: CreatedExerciseResponse = {
  userId: 1,
  exerciseId: 1,
  description: "Test exercise",
  duration: 30,
  date: "2020-02-29T00:00:00.000Z",
};

export const setupControllerTest = () => {
  const mockUserModel: jest.Mocked<UserModel> = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
  } as any;

  const mockExerciseModel: jest.Mocked<ExerciseModel> = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    countByUserId: jest.fn(),
  } as any;

  const controller = createUserController(mockUserModel, mockExerciseModel);

  const resJson = jest.fn();
  const resStatus = jest.fn(() => ({ json: resJson }));
  const mockRes: Partial<Response> = {
    status: resStatus as any,
    json: resJson as any,
  };

  const mockReq: Partial<Request> = {
    body: {},
    query: {},
    user: mockUser,
  };

  return {
    mockUserModel,
    mockExerciseModel,
    controller,
    mockReq,
    mockRes,
    resJson,
    resStatus,
  };
};
