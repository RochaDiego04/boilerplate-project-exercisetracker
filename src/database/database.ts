import { Database } from "sqlite-async";
import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), "db");
const DB_FILE =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : path.join(DB_DIR, "exercise.db");

export async function initializeDB() {
  try {
    if (process.env.NODE_ENV !== "test") {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
    }

    const db = await Database.open(DB_FILE);
    await createTables(db);
    return db;
  } catch (err: any) {
    throw new Error(`DB init error: ${err.message}`);
  }
}

async function createTables(db: any) {
  await db.run(`
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

export async function closeDB(db: { close: () => any }) {
  try {
    await db.close();
    console.log("Database closed");
  } catch (err: any) {
    console.error("Error closing database:", err.message);
  }
}
