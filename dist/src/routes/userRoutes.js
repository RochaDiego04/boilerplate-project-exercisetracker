"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userMiddleware_1 = require("../middleware/userMiddleware");
const router = (0, express_1.Router)();
router.route("/").get(userController_1.getAllUsers).post(userController_1.createUser);
router.route("/:_id/exercises").post(userMiddleware_1.checkUserExists, userController_1.createExercise);
router.route("/:_id/logs").get(userMiddleware_1.checkUserExists, userController_1.getUserLogs);
exports.default = router;
