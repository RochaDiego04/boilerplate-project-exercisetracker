import { Express } from "express";
import { UserModel } from "./src/models/User";
import { ExerciseModel } from "./src/models/Exercise";
import { closeDB, initializeDB } from "./src/database/database";
import { createApp } from "./src/app";

declare global {
  var app: Express;
  var db: any;
  var userModel: UserModel;
  var exerciseModel: ExerciseModel;
}

module.exports = async () => {
  global.db = await initializeDB();

  global.userModel = new UserModel(global.db);
  global.exerciseModel = new ExerciseModel(global.db);

  const app = createApp();
  app.locals.db = global.db;
  app.locals.userModel = global.userModel;
  app.locals.exerciseModel = global.exerciseModel;

  global.app = app;

  process.on("SIGINT", async () => {
    await closeDB(global.db);
  });
};
