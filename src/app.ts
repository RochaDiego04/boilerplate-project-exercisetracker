import express, { Express, Request, Response } from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes";

const app: Express = express();

declare module "express" {
  interface Application {
    locals: {
      db: any;
    };
  }
}

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/v1/users", userRouter);

export default app;
