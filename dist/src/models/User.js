"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(db) {
        this.db = db;
    }
    async create(username) {
        const result = await this.db.run("INSERT INTO users (username) VALUES (?)", username);
        return { id: result.lastID, username };
    }
    async findById(id) {
        return this.db.get("SELECT id, username FROM users WHERE id = ?", id);
    }
    async getAll() {
        return this.db.all("SELECT id AS _id, username FROM users");
    }
}
exports.UserModel = UserModel;
