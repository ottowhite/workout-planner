'use client';

import React, { useState, useMemo } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { WorkoutPlanner } from '@/lib/workoutPlanner';
import { Workout, WorkoutGenerationParams, ExerciseDatabase } from '@/lib/types';
import WorkoutPlannerForm from '@/components/WorkoutPlannerForm';
import WorkoutDisplay from '@/components/WorkoutDisplay';
import exerciseData from '@/data/exercises.json';

export default function Home() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workoutPlanner = useMemo(() => {
    const data = exerciseData as ExerciseDatabase;
    return new WorkoutPlanner(data.exercises);
  }, []);

  const availableMuscleGroups = useMemo(() => {
    const data = exerciseData as ExerciseDatabase;
    const groups = new Set<string>();
    data.exercises.forEach(exercise => {
      exercise.tags.forEach(tag => groups.add(tag));
    });
    return Array.from(groups).sort();
  }, []);

  const handleGenerateWorkout = async (params: WorkoutGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newWorkout = workoutPlanner.generateWorkout(params);
      setWorkout(newWorkout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred generating the workout');
      setWorkout(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          💪 Workout Planner
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Generate personalized workout routines based on your preferences
        </Typography>
      </Box>

      <Box mb={4}>
        <WorkoutPlannerForm
          availableMuscleGroups={availableMuscleGroups}
          onGenerateWorkout={handleGenerateWorkout}
          isGenerating={isGenerating}
          error={error}
        />
      </Box>

      {workout && (
        <Box>
          <WorkoutDisplay workout={workout} />
        </Box>
      )}

      {!workout && !isGenerating && (
        <Box textAlign="center" mt={6}>
          <Typography variant="body1" color="text.secondary">
            Configure your preferences above and click &quot;Generate Workout&quot; to create your personalized routine!
          </Typography>
        </Box>
      )}
    </Container>
  );
}
