"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database/database");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
(0, database_1.initializeDB)()
    .then((db) => {
    app_1.default.locals.db = db;
    const server = app_1.default.listen(PORT, () => {
        const serverAddress = server.address();
        console.log("Your app is listening on port " + serverAddress.port);
    });
    process.on("SIGINT", () => {
        (0, database_1.closeDB)(db).then(() => {
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
