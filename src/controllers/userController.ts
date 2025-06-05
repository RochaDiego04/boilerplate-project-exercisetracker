import { Request, Response } from "express";

function getDB(req: Request) {
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

export const createUser = async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const db = getDB(req);

  try {
    const result = await db.run(
      "INSERT INTO users (username) VALUES (?)",
      username
    );
    res.json({ _id: result.lastID, username });
  } catch (err: any) {
    if (err.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      console.error("User creation error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
};

export const getUserLogs = async (req: Request, res: Response) => {
  const db = getDB(req);
  const { from, to, limit } = req.query;
  const userId = req.user?.id; // incoming accepted user ID from middleware

  try {
    let query = `
      SELECT id, description, duration, date 
      FROM exercises 
      WHERE userId = ?
    `;
    const params: any[] = [userId];

    if (from) {
      query += " AND date(date) >= date(?)";
      params.push(from);
    }
    if (to) {
      query += " AND date(date) <= date(?)";
      params.push(to);
    }

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit as string));
    }

    const result = await db.all(query, ...params);

    const formattedResult = result.map(
      (ex: { date: string | number | Date }) => ({
        ...ex,
        date: new Date(ex.date).toDateString(),
      })
    );

    res.json({
      _id: userId,
      username: req.user?.username,
      count: formattedResult.length,
      log: formattedResult,
    });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const createExercise = async (req: Request, res: Response) => {
  const db = getDB(req);
  const { description, duration, date } = req.body;
  const userId = req.user?.id; // incoming accepted user ID from middleware

  if (!description || !duration) {
    return res
      .status(400)
      .json({ error: "Description and duration are required" });
  }

  const exerciseDate = date ? new Date(date) : new Date();
  const dateISO = exerciseDate.toISOString();
  const dateString = exerciseDate.toDateString();

  try {
    const result = await db.run(
      "INSERT INTO exercises (userId, description, duration, date) VALUES (?, ?, ?, ?)",
      [userId, description, parseInt(duration), dateISO]
    );

    res.json({
      exerciseId: result.lastID,
      userId: userId,
      duration: parseInt(duration),
      description,
      date: dateString,
    });
  } catch (err) {
    console.error("Exercise creation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
