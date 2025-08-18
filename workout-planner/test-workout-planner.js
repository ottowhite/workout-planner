// Simple test script to verify the workout planner logic
const { WorkoutPlanner } = require('./src/lib/workoutPlanner.ts');
const exerciseData = require('./src/data/exercises.json');

// Test the workout planner with the same parameters as the Python version
const planner = new WorkoutPlanner(exerciseData.exercises);

const testParams = {
  duration_minutes: 30,
  muscle_groups: ['glutes', 'rear delts', 'chest'],
  time_split: {
    'glutes': 0.3,
    'rear delts': 0.3,
    'chest': 0.4
  }
};

try {
  console.log('Testing workout generation with parameters:');
  console.log('Duration:', testParams.duration_minutes, 'minutes');
  console.log('Muscle groups:', testParams.muscle_groups);
  console.log('Time split:', testParams.time_split);
  console.log();

  const workout = planner.generateWorkout(testParams);
  
  console.log('✅ Workout generated successfully!');
  console.log('Total duration:', workout.total_duration, 'minutes');
  console.log('Number of exercises:', workout.summary.exercises_count);
  console.log('Total sets:', workout.summary.total_sets);
  console.log('Exercise time:', workout.summary.total_exercise_time_minutes, 'minutes');
  
  console.log('\nExercises:');
  workout.exercises.forEach((ex, i) => {
    console.log(`${i + 1}. ${ex.name} (${ex.muscle_group}) - ${ex.sets} sets`);
  });
  
  console.log('\nMuscle group breakdown:');
  Object.entries(workout.summary.muscle_group_breakdown).forEach(([group, time]) => {
    console.log(`  ${group}: ${Math.round(time / 60 * 10) / 10} minutes`);
  });

} catch (error) {
  console.error('❌ Error generating workout:', error.message);
}