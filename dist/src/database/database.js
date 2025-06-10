"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDB = initializeDB;
exports.closeDB = closeDB;
const { Database } = require("sqlite-async");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_DIR = path_1.default.join(process.cwd(), "db");
const DB_FILE = path_1.default.join(DB_DIR, "exercise.db");
async function initializeDB() {
    try {
        // Create db directory if it doesn't exist
        if (!fs_1.default.existsSync(DB_DIR)) {
            fs_1.default.mkdirSync(DB_DIR, { recursive: true });
            console.log(`Created database directory: ${DB_DIR}`);
        }
        console.log(`Opening database at: ${DB_FILE}`);
        const db = await Database.open(DB_FILE);
        await createTables(db);
        console.log("Database initialized successfully");
        return db;
    }
    catch (err) {
        console.error("Database initialization error:", err.message);
        throw new Error(`Could not open database: ${err.message}`);
    }
}
async function createTables(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            description TEXT NOT NULL,
            duration INTEGER NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY(userId) REFERENCES users(id)
        );
    `);
    console.log("Database tables created/verified");
}
async function closeDB(db) {
    try {
        await db.close();
        console.log("Database closed");
    }
    catch (err) {
        console.error("Error closing database:", err.message);
    }
}
