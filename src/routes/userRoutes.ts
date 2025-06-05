import { Router } from "express";
import {
  createExercise,
  createUser,
  getAllUsers,
} from "../controllers/userController";
import { checkUserExists } from "../middleware/userMiddleware";

const router: Router = Router();

router.route("/").get(getAllUsers).post(createUser);

router.route("/:_id/exercises").post(checkUserExists, createExercise);

export default router;
