// Simple test to verify the workout generation logic works
import fs from 'fs';
import path from 'path';

// Read the exercises data
const exerciseData = JSON.parse(fs.readFileSync('./src/data/exercises.json', 'utf8'));

console.log('✅ Successfully loaded exercise data');
console.log(`Found ${exerciseData.exercises.length} exercises`);

// Extract unique muscle groups
const muscleGroups = new Set();
exerciseData.exercises.forEach(exercise => {
  exercise.tags.forEach(tag => muscleGroups.add(tag));
});

console.log(`Found ${muscleGroups.size} unique muscle groups/tags:`);
console.log([...muscleGroups].sort().join(', '));

// Test finding exercises for specific muscle groups
const testGroups = ['glutes', 'rear delts', 'chest'];
testGroups.forEach(group => {
  const exercises = exerciseData.exercises.filter(ex =>
    ex.tags.some(tag => tag.toLowerCase() === group.toLowerCase())
  );
  console.log(`\n${group}: ${exercises.length} exercises found`);
  exercises.forEach(ex => console.log(`  - ${ex.name}`));
});

console.log('\n✅ Basic data validation complete!');