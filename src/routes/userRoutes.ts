import { Router } from "express";
import { UserModel } from "../models/User";
import { ExerciseModel } from "../models/Exercise";
import { createUserController } from "../controllers/userController";
import { createCheckUserExists } from "../middleware/userMiddleware";

export function createUserRouter(
  userModel: UserModel,
  exerciseModel: ExerciseModel
) {
  const router: Router = Router();
  const { getAllUsers, createUser, createExercise, getUserLogs } =
    createUserController(userModel, exerciseModel);
  const checkUserExists = createCheckUserExists(userModel);

  router.route("/").get(getAllUsers).post(createUser);
  router.route("/:_id/exercises").post(checkUserExists, createExercise);
  router.route("/:_id/logs").get(checkUserExists, getUserLogs);

  return router;
}
