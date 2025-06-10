import { User } from "./User";

export interface CreatedExerciseResponse {
  userId: number;
  exerciseId: number;
  duration: number;
  description: string;
  date: string;
}

export interface Exercise {
  id: number;
  description: string;
  duration: number;
  date: string;
}

export interface ExerciseFilters {
  from?: string;
  to?: string;
  limit?: number;
}

export interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}
