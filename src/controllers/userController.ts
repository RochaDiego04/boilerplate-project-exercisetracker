import { Request, Response } from "express";
import { Database } from "sqlite3";

function getDB(req: Request): Database {
  return req.app.locals.db;
}

export const getAllUsers = async (req: Request, res: Response) => {
  const db = getDB(req);
  try {
    const users = await db.all("SELECT id AS _id, username FROM users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createUser = (req: Request, res: Response) => {
  const { username } = req.body;
  const db = getDB(req);
  db.run(
    "INSERT INTO users (username) VALUES (?)",
    username,
    function (err: Error | null) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          res.status(400).json({ error: "Username already exists" });
        } else {
          res.status(500).json({ error: "Server error" });
        }
      } else {
        res.json({ _id: this.lastID, username });
      }
    }
  );
};
