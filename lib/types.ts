export type Topic = "chest" | "back" | "shoulders" | "legs";

export interface WorkoutSet {
  weight: number; // kg
  reps: number;
}

export interface Movement {
  id: string;
  exercise: string;
  sets: WorkoutSet[];
}

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  topic: Topic;
  movements: Movement[];
}
