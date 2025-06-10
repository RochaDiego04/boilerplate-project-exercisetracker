"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseModel = void 0;
class ExerciseModel {
    constructor(db) {
        this.db = db;
    }
    async create(userId, description, duration, date) {
        const result = await this.db.run("INSERT INTO exercises (userId, description, duration, date) VALUES (?, ?, ?, ?)", [userId, description, duration, date]);
        return {
            exerciseId: result.lastID,
            userId,
            duration,
            description,
            date: new Date(date).toDateString(),
        };
    }
    async findByUserId(userId, filters = {}) {
        let query = "SELECT * FROM exercises WHERE userId = ?";
        const params = [userId];
        if (filters.from) {
            query += " AND date(date) >= date(?)";
            params.push(filters.from);
        }
        if (filters.to) {
            query += " AND date(date) <= date(?)";
            params.push(filters.to);
        }
        if (filters.limit) {
            query += " LIMIT ?";
            params.push(filters.limit);
        }
        return this.db.all(query, ...params);
    }
}
exports.ExerciseModel = ExerciseModel;
