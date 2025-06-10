import { Router } from "express";
import { UserModel } from "../models/User";
import { ExerciseModel } from "../models/Exercise";
import { createUserController } from "../controllers/userController";

export function createUserRouter(
  userModel: UserModel,
  exerciseModel: ExerciseModel
) {
  const router: Router = Router();
  const { getAllUsers, createUser, createExercise, getUserLogs } =
    createUserController(userModel, exerciseModel);

  router.route("/").get(getAllUsers).post(createUser);
  router.route("/:_id/exercises").post(createExercise);
  router.route("/:_id/logs").get(getUserLogs);

  return router;
}
