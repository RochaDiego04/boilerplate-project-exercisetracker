import {
  CreatedExerciseResponse,
  Exercise,
  ExerciseFilters,
} from "../interfaces/Exercise";

export class ExerciseModel {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async create(
    userId: number,
    description: string,
    duration: number,
    date: string
  ): Promise<CreatedExerciseResponse> {
    const result = await this.db.run(
      "INSERT INTO exercises (userId, description, duration, date) VALUES (?, ?, ?, ?)",
      [userId, description, duration, date]
    );

    return {
      exerciseId: result.lastID,
      userId,
      duration,
      description,
      date: new Date(date).toDateString(),
    };
  }

  async findByUserId(
    userId: number,
    filters: ExerciseFilters = {}
  ): Promise<Exercise[]> {
    let query = "SELECT * FROM exercises WHERE userId = ?";
    const params: any[] = [userId];

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
