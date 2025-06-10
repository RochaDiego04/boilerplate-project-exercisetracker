import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createUserRouter } from "./routes/userRoutes";
import { UserModel } from "./models/User";
import { ExerciseModel } from "./models/Exercise";

export function createApp(
  userModel: UserModel,
  exerciseModel: ExerciseModel
): Express {
  const app: Express = express();

  app.use(cors());
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Endpoint not found" });
  });

  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app.use("/api/users", createUserRouter(userModel, exerciseModel));

  return app;
}
