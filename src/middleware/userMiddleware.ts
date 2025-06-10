import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { User } from "../interfaces/User";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function createCheckUserExists(userModel: UserModel) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const _id = parseInt(req.params._id);

    if (!_id || isNaN(_id)) {
      return res.status(400).json({ error: "User id is required" });
    }

    try {
      const user = await userModel.findById(_id);
      if (!user) {
        return res
          .status(404)
          .json({ error: `User not found with id: ${_id}` });
      }
      req.user = user;

      next();
    } catch (err) {
      console.error("User check error:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
}
