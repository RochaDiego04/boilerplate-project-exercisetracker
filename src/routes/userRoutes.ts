import { Router } from "express";
import {
  createExercise,
  createUser,
  getAllUsers,
  getUserLogs,
} from "../controllers/userController";
import { checkUserExists } from "../middleware/userMiddleware";

const router: Router = Router();

router.route("/").get(getAllUsers).post(createUser);

router.route("/:_id/exercises").post(checkUserExists, createExercise);

router.route("/:_id/logs").get(checkUserExists, getUserLogs);

export default router;
