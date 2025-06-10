"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExists = void 0;
const checkUserExists = async (req, res, next) => {
    const userId = parseInt(req.params._id);
    const { userModel } = req.app.locals;
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "User id is required" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error("User check error:", err);
        res.status(500).json({ error: "Server error" });
    }
};
exports.checkUserExists = checkUserExists;
