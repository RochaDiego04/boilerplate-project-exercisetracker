import request from "supertest";
import { jest } from "@jest/globals";
import { UserModel } from "../../models/User";
import { ExerciseModel } from "../../models/Exercise";

jest.unstable_mockModule("../database/database.ts", () => ({
  db: { all: jest.fn() },
}));

beforeEach(async () => {
  jest.resetModules();
  ({ db } = await import("../database/database.ts"));
});

describe("User Routes", () => {
  beforeEach(async () => {});

  test("POST /api/v1/users - creates user", async () => {});
});
