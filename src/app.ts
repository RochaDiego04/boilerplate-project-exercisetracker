import express, { Express, Request, Response } from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes";

const app: Express = express();

app.use(cors());
app.use(express.static("public"));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/v1/users", userRouter);

export default app;
