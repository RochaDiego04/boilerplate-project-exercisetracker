const { Database } = require("sqlite-async");
import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");
const DB_FILE = path.join(DB_DIR, "exercise.db");

export async function initializeDB() {
  try {
    // Create db directory if it doesn't exist
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
      console.log(`Created database directory: ${DB_DIR}`);
    }

    console.log(`Opening database at: ${DB_FILE}`);
    const db = await Database.open(DB_FILE);
    await createTables(db);
    console.log("Database initialized successfully");
    return db;
  } catch (err: any) {
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

export async function closeDB(db) {
  try {
    await db.close();
    console.log("Database closed");
  } catch (err: any) {
    console.error("Error closing database:", err.message);
  }
}
