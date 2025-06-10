import dotenv from "dotenv";
import { AddressInfo } from "net";
import { createApp } from "./app";
import { initializeDB, closeDB } from "./database/database";
import { UserModel } from "./models/User";
import { ExerciseModel } from "./models/Exercise";

dotenv.config();

const PORT: string | number = process.env.PORT || 3000;

initializeDB()
  .then((db) => {
    const userModel = new UserModel(db);
    const exerciseModel = new ExerciseModel(db);

    const app = createApp(userModel, exerciseModel);

    const server = app.listen(PORT, () => {
      const serverAddress = server.address() as AddressInfo;
      console.log("Your app is listening on port " + serverAddress.port);
    });

    process.on("SIGINT", () => {
      closeDB(db).then(() => {
        server.close(() => {
          console.log("Server and database closed");
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
