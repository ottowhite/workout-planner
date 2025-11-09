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

export interface MuscleGroupConfig {
  id: string;
  muscle_group: string;
  exercises_count: number;
  sets_per_exercise: number;
}

export interface ExerciseDatabaseDefaults {
  muscle_groups: Array<{
    muscle_group: string;
    exercises_count: number;
    sets_per_exercise: number;
  }>;
}

export interface ExerciseDatabase {
  exercises: Exercise[];
  defaults?: ExerciseDatabaseDefaults;
}

export interface WorkoutGenerationParams {
  muscle_group_configs: MuscleGroupConfig[];
}

export interface AppConfig {
  default_exercise_set: string;
}