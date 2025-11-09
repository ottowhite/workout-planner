'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { FitnessCenter, Add, Delete } from '@mui/icons-material';
import { WorkoutGenerationParams, MuscleGroupConfig, ExerciseDatabaseDefaults } from '@/lib/types';

interface ExerciseFile {
  id: string;
  name: string;
  filename: string;
}

interface WorkoutPlannerFormProps {
  availableMuscleGroups: string[];
  onGenerateWorkout: (params: WorkoutGenerationParams) => void;
  isGenerating?: boolean;
  error?: string | null;
  exerciseFiles: ExerciseFile[];
  selectedExerciseFile: string;
  onExerciseFileChange: (fileId: string) => void;
  exerciseDefaults?: ExerciseDatabaseDefaults;
}

export default function WorkoutPlannerForm({
  availableMuscleGroups,
  onGenerateWorkout,
  isGenerating = false,
  error = null,
  exerciseFiles,
  selectedExerciseFile,
  onExerciseFileChange,
  exerciseDefaults
}: WorkoutPlannerFormProps) {
  const [muscleGroupConfigs, setMuscleGroupConfigs] = useState<MuscleGroupConfig[]>([
    { id: '1', muscle_group: 'core', exercises_count: 1, sets_per_exercise: 3 },
    { id: '2', muscle_group: 'glutes', exercises_count: 1, sets_per_exercise: 3 },
    { id: '3', muscle_group: 'rear delts', exercises_count: 1, sets_per_exercise: 3 },
  ]);

  // Load defaults from exercise database when they change
  useEffect(() => {
    if (exerciseDefaults?.muscle_groups && exerciseDefaults.muscle_groups.length > 0) {
      const defaultConfigs = exerciseDefaults.muscle_groups.map((group, index) => ({
        id: `default-${index}`,
        muscle_group: group.muscle_group,
        exercises_count: group.exercises_count,
        sets_per_exercise: group.sets_per_exercise
      }));
      setMuscleGroupConfigs(defaultConfigs);
    }
  }, [exerciseDefaults]);

  const handleExerciseFileChange = useCallback((event: SelectChangeEvent) => {
    onExerciseFileChange(event.target.value);
  }, [onExerciseFileChange]);

  const handleAddMuscleGroup = useCallback(() => {
    const newId = Date.now().toString();
    setMuscleGroupConfigs(prev => [
      ...prev,
      { id: newId, muscle_group: availableMuscleGroups[0] || '', exercises_count: 1, sets_per_exercise: 3 }
    ]);
  }, [availableMuscleGroups]);

  const handleRemoveMuscleGroup = useCallback((id: string) => {
    setMuscleGroupConfigs(prev => prev.filter(config => config.id !== id));
  }, []);

  const handleMuscleGroupChange = useCallback((id: string, value: string) => {
    setMuscleGroupConfigs(prev =>
      prev.map(config => config.id === id ? { ...config, muscle_group: value } : config)
    );
  }, []);

  const handleExercisesCountChange = useCallback((id: string, value: number) => {
    setMuscleGroupConfigs(prev =>
      prev.map(config => config.id === id ? { ...config, exercises_count: value } : config)
    );
  }, []);

  const handleSetsChange = useCallback((id: string, value: number) => {
    setMuscleGroupConfigs(prev =>
      prev.map(config => config.id === id ? { ...config, sets_per_exercise: value } : config)
    );
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (muscleGroupConfigs.length === 0) {
      return;
    }

    onGenerateWorkout({
      muscle_group_configs: muscleGroupConfigs
    });
  }, [muscleGroupConfigs, onGenerateWorkout]);

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
            {/* Exercise File Selection */}
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Exercise Set</InputLabel>
                <Select
                  value={selectedExerciseFile}
                  onChange={handleExerciseFileChange}
                  label="Exercise Set"
                >
                  {exerciseFiles.map((file) => (
                    <MenuItem key={file.id} value={file.id}>
                      {file.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Muscle Group Configurations */}
            <Grid size={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Muscle Groups</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddMuscleGroup}
                  disabled={isGenerating}
                >
                  Add Muscle Group
                </Button>
              </Box>

              {muscleGroupConfigs.map((config) => (
                <Paper key={config.id} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Muscle Group Dropdown */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Muscle Group</InputLabel>
                        <Select
                          value={config.muscle_group}
                          onChange={(e) => handleMuscleGroupChange(config.id, e.target.value)}
                          label="Muscle Group"
                          disabled={isGenerating}
                        >
                          {availableMuscleGroups.map((group) => (
                            <MenuItem key={group} value={group}>
                              {group}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Exercises Count */}
                    <Grid size={{ xs: 5, sm: 3 }}>
                      <TextField
                        label="Exercises"
                        type="number"
                        size="small"
                        fullWidth
                        value={config.exercises_count}
                        onChange={(e) => handleExercisesCountChange(config.id, Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, max: 10 }}
                        disabled={isGenerating}
                      />
                    </Grid>

                    {/* Sets Count */}
                    <Grid size={{ xs: 5, sm: 3 }}>
                      <TextField
                        label="Sets"
                        type="number"
                        size="small"
                        fullWidth
                        value={config.sets_per_exercise}
                        onChange={(e) => handleSetsChange(config.id, Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, max: 10 }}
                        disabled={isGenerating}
                      />
                    </Grid>

                    {/* Remove Button */}
                    <Grid size={{ xs: 2, sm: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveMuscleGroup(config.id)}
                        disabled={muscleGroupConfigs.length === 1 || isGenerating}
                        aria-label="remove muscle group"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
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
                disabled={muscleGroupConfigs.length === 0 || isGenerating}
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