# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Python workout planner that generates personalized workout routines based on:
- Duration preferences (in minutes)
- Target muscle groups
- Time allocation per muscle group
- Exercise database stored in JSON format

## Commands

### Running the Application
```bash
python3 main.py
```
Runs the example workout generation with predefined parameters (30-minute workout targeting glutes, rear delts, and chest).

### Testing the Application
No formal test framework is configured. Testing should be done by running the main script and validating output manually.

## Code Architecture

### Core Components

**WorkoutPlanner Class (`main.py:6-172`)**
- Main application class that handles workout generation logic
- Loads exercise database from `exercises.json` on initialization
- Key methods:
  - `generate_workout()`: Main workflow that creates complete workout plans
  - `_select_exercises_for_group()`: Selects exercises for specific muscle groups within time constraints
  - `_calculate_summary()`: Computes workout statistics
  - `print_workout()`: Formatted output display

**Exercise Data Structure (`exercises.json`)**
- JSON array containing exercise objects with:
  - `name`: Exercise name
  - `set_duration_sec`: Work period duration
  - `rest_duration_sec`: Rest period between sets
  - `tags`: Array of muscle groups and exercise categories
  - `notes`: Optional exercise notes
  - `link`: Optional video/reference links

### Workout Generation Logic

1. **Time Allocation**: Reserves 10 minutes for warmup (5 min cardio + 5 min stretching)
2. **Exercise Selection**: Uses tag-based filtering to match exercises to requested muscle groups
3. **Set Calculation**: Dynamically calculates number of sets (3-5) based on available time
4. **Organization**: Groups exercises by muscle group to prevent interleaving

### Key Features

- **Tag-based Exercise Filtering**: Exercises are categorized using hierarchical tags (e.g., "core family", "glutes", "rear delts")
- **Dynamic Time Management**: Automatically fits exercises within specified duration constraints
- **Structured Warmup**: Always includes standardized 10-minute warmup routine
- **Comprehensive Output**: Provides detailed workout plan with timing, sets, and exercise notes

## TODOs and Development Plans

The codebase includes several planned enhancements (`main.py:173-180`):
- Split exercises into multiple organized files
- Add frontend interface for workout customization
- Implement hierarchical tag system
- Add exercise progressions and supersets
- Enhance exercise selection algorithms
- Support for specific exercise preferences

## Exercise Database Management

The `exercises.json` file contains a comprehensive exercise library organized by:
- **Core Family**: Core stability, rotator cuff, scapular stability
- **Glutes**: Hip thrusts, bridges, lateral movements
- **General Exercises**: Push-ups, pull-ups, deadlifts

Each exercise includes timing parameters and muscle group tags for automated selection during workout generation.