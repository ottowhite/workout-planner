export interface Exercise {
  name: string;
  set_duration_sec: number;
  rest_duration_sec: number;
  tags: string[];
  notes?: string | null;
  link?: string | null;
}

export interface ExerciseBlock {
  name: string;
  sets: number;
  set_duration_sec: number;
  rest_duration_sec: number;
  muscle_group: string;
  notes: string;
  link: string;
}

export interface WorkoutSummary {
  total_sets: number;
  muscle_group_breakdown: Record<string, number>;
  exercises_count: number;
}

export interface Workout {
  exercises: ExerciseBlock[];
  summary: WorkoutSummary;
}

export interface ExerciseDatabase {
  exercises: Exercise[];
}

export interface WorkoutGenerationParams {
  muscle_groups: string[];
  exercises_per_group: number;
  sets_per_exercise: number;
}