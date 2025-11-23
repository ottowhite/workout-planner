'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { WorkoutPlanner } from '@/lib/workoutPlanner';
import { Workout, WorkoutGenerationParams, ExerciseDatabase, AppConfig } from '@/lib/types';
import WorkoutPlannerForm from '@/components/WorkoutPlannerForm';
import WorkoutDisplay from '@/components/WorkoutDisplay';
// Database connection check moved to API route

interface ExerciseFile {
  id: string;
  name: string;
  filename: string;
}

export default function Home() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exerciseFiles, setExerciseFiles] = useState<ExerciseFile[]>([]);
  const [selectedExerciseFile, setSelectedExerciseFile] = useState<string>('');
  const [exerciseData, setExerciseData] = useState<ExerciseDatabase | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [showDbNotification, setShowDbNotification] = useState(false);

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check database connection on mount
  useEffect(() => {
    if (!isMounted) return;

    const checkDatabase = async () => {
      try {
        const response = await fetch('/api/db-status');
        const data = await response.json();
        setDbStatus(data.status);
        setShowDbNotification(true);
      } catch (error) {
        console.error('Database connection check failed:', error);
        setDbStatus('Database connection check failed');
        setShowDbNotification(true);
      }
    };

    checkDatabase();
  }, [isMounted]);

  // Load config to determine default exercise set
  useEffect(() => {
    if (!isMounted) return;

    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json');
        const config = await response.json() as AppConfig;
        if (config.default_exercise_set) {
          setSelectedExerciseFile(config.default_exercise_set);
        }
      } catch (err) {
        console.error('Failed to load config, using fallback default:', err);
        setSelectedExerciseFile('exercises');
      }
    };

    loadConfig();
  }, [isMounted]);

  // Fetch available exercise files
  useEffect(() => {
    if (!isMounted) return;

    const fetchExerciseFiles = async () => {
      setIsLoadingFiles(true);
      try {
        const response = await fetch('/api/exercises');
        const files = await response.json();
        setExerciseFiles(files);
        if (files.length > 0 && !selectedExerciseFile) {
          setSelectedExerciseFile(files[0].id);
        }
      } catch (err) {
        console.error('Failed to load exercise files:', err);
        setError('Failed to load exercise files');
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchExerciseFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Load selected exercise file
  useEffect(() => {
    const loadExerciseData = async () => {
      if (!selectedExerciseFile) return;

      try {
        const response = await fetch(`/exercises/${selectedExerciseFile}.json`);
        const data = await response.json();
        setExerciseData(data as ExerciseDatabase);
        setWorkout(null); // Clear current workout when switching exercise files
      } catch (err) {
        console.error('Failed to load exercise data:', err);
        setError('Failed to load exercise data');
      }
    };

    loadExerciseData();
  }, [selectedExerciseFile]);

  const workoutPlanner = useMemo(() => {
    if (!exerciseData) return null;
    return new WorkoutPlanner(exerciseData.exercises);
  }, [exerciseData]);

  const availableMuscleGroups = useMemo(() => {
    if (!exerciseData) return [];
    const groups = new Set<string>();
    exerciseData.exercises.forEach(exercise => {
      exercise.tags.forEach(tag => groups.add(tag));
    });
    return Array.from(groups).sort();
  }, [exerciseData]);

  const handleGenerateWorkout = async (params: WorkoutGenerationParams) => {
    if (!workoutPlanner) return;

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

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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

      {isLoadingFiles ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mb={4}>
            <WorkoutPlannerForm
              availableMuscleGroups={availableMuscleGroups}
              onGenerateWorkout={handleGenerateWorkout}
              isGenerating={isGenerating}
              error={error}
              exerciseFiles={exerciseFiles}
              selectedExerciseFile={selectedExerciseFile}
              onExerciseFileChange={setSelectedExerciseFile}
              exerciseDefaults={exerciseData?.defaults}
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
        </>
      )}

      {/* Database Connection Status Notification */}
      <Snackbar
        open={showDbNotification}
        autoHideDuration={6000}
        onClose={() => setShowDbNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowDbNotification(false)}
          severity={dbStatus === 'Database connected' ? 'success' : 'warning'}
          variant="filled"
        >
          {dbStatus}
        </Alert>
      </Snackbar>
    </Container>
  );
}
