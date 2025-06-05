interface CreatedExerciseResponse {
  userId: number;
  exerciseId: number;
  duration: number;
  description: string;
  date: string;
}

interface Exercise {
  id: number;
  description: string;
  duration: number;
  date: string;
}

interface UserExerciseLog extends User {
  logs: Exercise[];
  count: number;
}
