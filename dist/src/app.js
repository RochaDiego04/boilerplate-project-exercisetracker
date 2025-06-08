"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});
app.use("/api/v1/users", userRoutes_1.default);
exports.default = app;
