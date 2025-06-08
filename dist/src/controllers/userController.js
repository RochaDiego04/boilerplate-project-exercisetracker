"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExercise = exports.getUserLogs = exports.createUser = exports.getAllUsers = void 0;
const getAllUsers = async (req, res) => {
    const { userModel } = req.app.locals;
    try {
        const users = await userModel.getAll();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    const { username } = req.body;
    const { userModel } = req.app.locals;
    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    try {
        const user = await userModel.create(username);
        res.json(user);
    }
    catch (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            res.status(400).json({ error: "Username already exists" });
        }
        else {
            console.error("User creation error:", err);
            res.status(500).json({ error: "Server error" });
        }
    }
};
exports.createUser = createUser;
const getUserLogs = async (req, res) => {
    const { exerciseModel } = req.app.locals;
    const { from, to, limit } = req.query;
    const userId = req.user?.id; // incoming accepted user ID from middleware
    if (!userId) {
        return res.status(400).json({ error: "User ID missing" });
    }
    try {
        const exercises = await exerciseModel.findByUserId(userId, {
            from: from,
            to: to,
            limit: limit ? parseInt(limit) : undefined,
        });
        const response = {
            id: +userId,
            username: req.user?.username || "",
            count: exercises.length,
            logs: exercises,
        };
        res.json(response);
    }
    catch (err) {
        console.error("Error fetching logs:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.getUserLogs = getUserLogs;
const createExercise = async (req, res) => {
    const { exerciseModel } = req.app.locals;
    const { description, duration, date } = req.body;
    const userId = req.user?.id; // incoming accepted user ID from middleware
    if (!description || !duration) {
        return res
            .status(400)
            .json({ error: "Description and duration are required" });
    }
    if (!userId) {
        return res.status(400).json({ error: "User ID missing" });
    }
    const exerciseDate = date ? new Date(date) : new Date();
    const dateISO = exerciseDate.toISOString();
    try {
        const response = await exerciseModel.create(userId, description, parseInt(duration), dateISO);
        res.json(response);
    }
    catch (err) {
        console.error("Exercise creation error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.createExercise = createExercise;
