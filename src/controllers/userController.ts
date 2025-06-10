import { Request, Response } from "express";
import {
  CreatedExerciseResponse,
  UserExerciseLog,
} from "../interfaces/Exercise";
import { isValidDate } from "../utils/dateValidator";
import { UserModel } from "../models/User";
import { ExerciseModel } from "../models/Exercise";

export function createUserController(
  userModel: UserModel,
  exerciseModel: ExerciseModel
) {
  const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userModel.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  };

  const createUser = async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    try {
      const user = await userModel.create(username);
      res.json(user);
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Username already exists" });
      } else {
        console.error("User creation error:", err);
        res.status(500).json({ error: "Server error" });
      }
    }
  };

  const getUserLogs = async (req: Request, res: Response) => {
    const { from, to, limit } = req.query;
    const userId = req.user?.id; // incoming accepted user ID from middleware

    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    if (from && (typeof from !== "string" || !isValidDate(from))) {
      return res
        .status(400)
        .json({ error: "Invalid 'from' date format. Use yyyy-mm-dd" });
    }

    if (to && (typeof to !== "string" || !isValidDate(to))) {
      return res
        .status(400)
        .json({ error: "Invalid 'to' date format. Use yyyy-mm-dd" });
    }

    try {
      const exercises = await exerciseModel.findByUserId(userId, {
        from: from as string,
        to: to as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      const response: UserExerciseLog = {
        id: +userId,
        username: req.user?.username || "",
        count: exercises.length,
        logs: exercises,
      };

      res.json(response);
    } catch (err) {
      console.error("Error fetching logs:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

  const createExercise = async (req: Request, res: Response) => {
    const { description, duration, date } = req.body;
    const userId = req.user?.id; // incoming accepted user ID from middleware

    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    if (!description || !duration) {
      return res
        .status(400)
        .json({ error: "Description and duration are required" });
    }

    if (date && (typeof date !== "string" || !isValidDate(date))) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use yyyy-mm-dd" });
    }

    const exerciseDate = date ? new Date(date) : new Date();
    const dateISO = exerciseDate.toISOString();

    try {
      const response: CreatedExerciseResponse = await exerciseModel.create(
        userId,
        description,
        parseInt(duration),
        dateISO
      );

      res.json(response);
    } catch (err) {
      console.error("Exercise creation error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

  return {
    getAllUsers,
    createUser,
    getUserLogs,
    createExercise,
  };
}
