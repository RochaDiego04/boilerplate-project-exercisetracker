import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string };
    }
  }
}

function getDB(req: Request) {
  return req.app.locals.db;
}

export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params._id;

  if (!userId) {
    return res.status(400).json({ error: "User id is required" });
  }

  const db = getDB(req);

  try {
    const user = await db.get("SELECT id, username FROM users WHERE id = ?", [
      userId,
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("User check error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
