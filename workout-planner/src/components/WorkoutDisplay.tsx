'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Grid,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import {
  Timer,
  FitnessCenter,
  ExpandMore,
  PlayCircleOutline,
} from '@mui/icons-material';
import { Workout } from '@/lib/types';

interface WorkoutDisplayProps {
  workout: Workout;
}

export default function WorkoutDisplay({ workout }: WorkoutDisplayProps) {

  return (
    <Box>
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Timer color="primary" />
            <Typography variant="h5" component="h2" color="primary">
              Your Workout Plan
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Workout Summary
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {workout.summary.exercises_count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exercises
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {workout.summary.total_sets}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sets
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {Object.keys(workout.summary.muscle_group_breakdown).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Muscle Groups
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>


      {/* Main Exercises */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box display="flex" alignItems="center" gap={1}>
            <FitnessCenter color="primary" />
            <Typography variant="h6">Main Exercises</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {workout.exercises.map((exercise, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6">{exercise.name}</Typography>
                        <Chip
                          label={exercise.muscle_group.toUpperCase()}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.primary" gutterBottom>
                          <strong>Sets:</strong> {exercise.sets} |
                          <strong> Work:</strong> {exercise.set_duration_sec}s |
                          <strong> Rest:</strong> {exercise.rest_duration_sec}s
                        </Typography>
                        {exercise.notes && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Notes:</strong> {exercise.notes}
                          </Typography>
                        )}
                        {exercise.link && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PlayCircleOutline fontSize="small" color="primary" />
                            <Link
                              href={exercise.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                            >
                              Watch Video
                            </Link>
                          </Box>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{ component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                {index < workout.exercises.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}