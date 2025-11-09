import { Exercise, ExerciseBlock, Workout, WorkoutSummary, WorkoutGenerationParams } from './types';

export class WorkoutPlanner {
  private exercises: Exercise[];

  constructor(exercises: Exercise[]) {
    this.exercises = exercises;
  }

  generateWorkout(params: WorkoutGenerationParams): Workout {
    const { muscle_group_configs } = params;

    const workout: Workout = {
      exercises: [],
      summary: {
        total_sets: 0,
        muscle_group_breakdown: {},
        exercises_count: 0
      }
    };

    // Generate exercises for each muscle group configuration
    for (const config of muscle_group_configs) {
      const groupExercises = this.selectExercisesForGroup(
        config.muscle_group,
        config.exercises_count,
        config.sets_per_exercise
      );
      workout.exercises.push(...groupExercises);
    }

    // Calculate summary
    workout.summary = this.calculateSummary(workout);

    return workout;
  }

  private selectExercisesForGroup(muscleGroup: string, exercisesCount: number, setsPerExercise: number): ExerciseBlock[] {
    // Find exercises that target this muscle group
    const suitableExercises = this.exercises.filter(ex =>
      ex.tags.some(tag => tag.toLowerCase() === muscleGroup.toLowerCase())
    );

    if (suitableExercises.length === 0) {
      throw new Error(`No exercises found for muscle group: ${muscleGroup}`);
    }

    const selectedExercises: ExerciseBlock[] = [];
    const usedExercises = new Set<string>();

    for (let i = 0; i < exercisesCount; i++) {
      // Find available exercises (not already used)
      const availableExercises = suitableExercises.filter(ex => !usedExercises.has(ex.name));
      
      if (availableExercises.length === 0) {
        // If we've used all exercises, start reusing them
        usedExercises.clear();
        availableExercises.push(...suitableExercises);
      }

      // Randomly select an exercise
      const exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
      usedExercises.add(exercise.name);

      const exerciseBlock: ExerciseBlock = {
        name: exercise.name,
        sets: setsPerExercise,
        set_duration_sec: exercise.set_duration_sec,
        rest_duration_sec: exercise.rest_duration_sec,
        muscle_group: muscleGroup,
        notes: exercise.notes || "",
        link: exercise.link || ""
      };

      selectedExercises.push(exerciseBlock);
    }

    return selectedExercises;
  }

  private calculateSummary(workout: Workout): WorkoutSummary {
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);

    const muscleGroupBreakdown: Record<string, number> = {};
    for (const ex of workout.exercises) {
      if (!(ex.muscle_group in muscleGroupBreakdown)) {
        muscleGroupBreakdown[ex.muscle_group] = 0;
      }
      muscleGroupBreakdown[ex.muscle_group]++;
    }

    return {
      total_sets: totalSets,
      muscle_group_breakdown: muscleGroupBreakdown,
      exercises_count: workout.exercises.length
    };
  }
}