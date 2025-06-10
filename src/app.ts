import express, { Express, Request, Response } from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes";

export function createApp(): Express {
  const app: Express = express();

  app.use(cors());
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app.use("/api/v1/users", userRouter);

  return app;
}
