import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController";

const router: Router = Router();

router.route("/").get(getAllUsers).post(createUser);

export default router;
