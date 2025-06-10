import { User } from "../interfaces/User";

export class UserModel {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async create(username: string): Promise<User> {
    const result = await this.db.run(
      "INSERT INTO users (username) VALUES (?)",
      username
    );
    return { id: result.lastID, username };
  }

  async findById(id: number): Promise<User | undefined> {
    return this.db.get("SELECT id, username FROM users WHERE id = ?", id);
  }

  async getAll(): Promise<User[]> {
    return this.db.all("SELECT id AS _id, username FROM users");
  }
}
