'use client';

import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import FitnessCenter from '@mui/icons-material/FitnessCenter';
import { WorkoutGenerationParams } from '@/lib/types';

interface WorkoutPlannerFormProps {
  availableMuscleGroups: string[];
  onGenerateWorkout: (params: WorkoutGenerationParams) => void;
  isGenerating?: boolean;
  error?: string | null;
}

export default function WorkoutPlannerForm({ 
  availableMuscleGroups, 
  onGenerateWorkout, 
  isGenerating = false,
  error = null 
}: WorkoutPlannerFormProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [exercisesPerGroup, setExercisesPerGroup] = useState<number>(2);
  const [setsPerExercise, setSetsPerExercise] = useState<number>(3);

  const handleMuscleGroupChange = useCallback((event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedMuscleGroups(value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMuscleGroups.length === 0) {
      return;
    }

    onGenerateWorkout({
      muscle_groups: selectedMuscleGroups,
      exercises_per_group: exercisesPerGroup,
      sets_per_exercise: setsPerExercise
    });
  }, [selectedMuscleGroups, exercisesPerGroup, setsPerExercise, onGenerateWorkout]);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <FitnessCenter color="primary" />
          <Typography variant="h5" component="h2" color="primary">
            Workout Planner
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Muscle Groups */}
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Muscle Groups</InputLabel>
                <Select
                  multiple
                  value={selectedMuscleGroups}
                  onChange={handleMuscleGroupChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableMuscleGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Exercises per Muscle Group */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Exercises per Muscle Group: {exercisesPerGroup}
              </Typography>
              <Slider
                value={exercisesPerGroup}
                onChange={(_, value) => setExercisesPerGroup(value as number)}
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' }
                ]}
                sx={{ mt: 1 }}
              />
            </Grid>

            {/* Sets per Exercise */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Sets per Exercise: {setsPerExercise}
              </Typography>
              <Slider
                value={setsPerExercise}
                onChange={(_, value) => setSetsPerExercise(value as number)}
                min={1}
                max={6}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                  { value: 6, label: '6' }
                ]}
                sx={{ mt: 1 }}
              />
            </Grid>

            {error && (
              <Grid size={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={selectedMuscleGroups.length === 0 || isGenerating}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <FitnessCenter />}
                sx={{ mt: 2 }}
              >
                {isGenerating ? 'Generating Workout...' : 'Generate Workout'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}