# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains both a Python workout planner and a modern Next.js web frontend that generates personalized workout routines based on:
- Duration preferences (in minutes)
- Target muscle groups
- Time allocation per muscle group
- Exercise database stored in JSON format (supports multiple exercise files)

## Commands

### Running the Python Application
```bash
python3 main.py
```
Runs the example workout generation with predefined parameters (30-minute workout targeting glutes, rear delts, and chest).

### Running the Next.js Frontend
```bash
cd workout-planner
npm install  # First time setup
npm run dev  # Development server at http://localhost:3000
npm run build  # Production build
```

### Testing the Applications
- **Python**: No formal test framework is configured. Testing should be done by running the main script and validating output manually.
- **Next.js**: The application includes TypeScript validation and ESLint checking. Run `npm run build` to validate the entire application.

## Code Architecture

### Python Components

**WorkoutPlanner Class (`main.py:6-172`)**
- Main application class that handles workout generation logic
- Loads exercise database from `exercises.json` on initialization
- Key methods:
  - `generate_workout()`: Main workflow that creates complete workout plans
  - `_select_exercises_for_group()`: Selects exercises for specific muscle groups within time constraints
  - `_calculate_summary()`: Computes workout statistics
  - `print_workout()`: Formatted output display

### Next.js Frontend Components

**Core Logic (`workout-planner/src/lib/`)**
- `workoutPlanner.ts`: TypeScript port of the Python WorkoutPlanner class with identical functionality
- `types.ts`: TypeScript interfaces for Exercise, Workout, and related data structures
- `theme.ts`: Material-UI theme configuration for consistent styling

**UI Components (`workout-planner/src/components/`)**
- `WorkoutPlannerForm.tsx`: Interactive form with duration slider, muscle group selection, and time allocation controls
- `WorkoutDisplay.tsx`: Beautiful workout display with collapsible sections, exercise details, and summary statistics
- `ThemeProvider.tsx`: Material-UI theme wrapper component

**Main Application (`workout-planner/src/app/`)**
- `page.tsx`: Main application page that orchestrates form and display components
- `layout.tsx`: Root layout with Material-UI theme provider

**Exercise Data Structure (`exercises.json`)**
- Shared JSON database used by both Python and TypeScript implementations
- Contains exercise objects with:
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

**Both Python and TypeScript Implementations:**
- **Tag-based Exercise Filtering**: Exercises are categorized using hierarchical tags (e.g., "core family", "glutes", "rear delts")
- **Dynamic Time Management**: Automatically fits exercises within specified duration constraints
- **Structured Warmup**: Always includes standardized 10-minute warmup routine
- **Identical Logic**: TypeScript implementation produces the same workout results as Python version

**Additional Frontend Features:**
- **Material Design UI**: Clean, modern interface following Google's Material Design principles
- **Multiple Exercise Sets**: Dropdown selector to switch between different exercise databases
- **Interactive Form Controls**: Duration sliders, multi-select muscle groups, dynamic time allocation
- **Real-time Validation**: Immediate feedback on input errors and time allocation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Beautiful Workout Display**: Collapsible sections, exercise details with video links, summary statistics
- **Loading States**: Professional loading indicators and error handling

## Implementation Status

### ✅ Completed Features
- **Frontend Interface**: Full Next.js Material-UI implementation completed
- **TypeScript Port**: Complete functional port of Python workout planner logic
- **Interactive UI**: Configurable duration, muscle groups, and time allocation
- **Exercise Display**: Beautiful workout presentation with all exercise details
- **Responsive Design**: Mobile-friendly Material Design interface
- **Multiple Exercise Files**: Support for multiple exercise databases with dynamic dropdown selector

### TODOs and Development Plans

The original codebase includes several planned enhancements (`main.py:173-180`):
- ~~Split exercises into multiple organized files~~ ✅ **COMPLETED**
- ~~Add frontend interface for workout customization~~ ✅ **COMPLETED**
- Implement hierarchical tag system
- Add exercise progressions and supersets
- Enhance exercise selection algorithms
- Support for specific exercise preferences

## Exercise Database Management

The application now supports multiple exercise database files stored in `workout-planner/public/exercises/`:

**Default Exercise Set (`exercises.json`)**:
- Comprehensive exercise library with 35+ exercises
- **Core Family**: Core stability, rotator cuff, scapular stability (15+ exercises)
- **Glutes**: Hip thrusts, bridges, lateral movements (13+ exercises)
- **General Exercises**: Push-ups, pull-ups, deadlifts
- **33 Unique Tags**: Including specific muscle groups like "rear delts", "glute medius", "rotator cuff"

**Example Alternative Set (`exercises-new.json`)**:
- Demonstrates multi-file support with 3 basic exercises
- Shows how to create custom exercise sets

### Adding New Exercise Files

To add a new exercise database:
1. Create a new JSON file in `workout-planner/public/exercises/` (e.g., `my-exercises.json`)
2. Follow the standard exercise JSON structure with an `exercises` array
3. The file will automatically appear in the frontend's exercise set dropdown
4. File names are automatically formatted (e.g., `exercises-new.json` → "Exercises New")

Each exercise includes timing parameters and muscle group tags for automated selection during workout generation.

## Technology Stack

### Frontend
- **Next.js 15** with TypeScript and App Router
- **Material-UI (MUI)** for Material Design components
- **React 18** with modern hooks and state management
- **ESLint** and **TypeScript** for code quality

### Backend Logic
- **Python 3** for original implementation
- **TypeScript** for frontend logic (identical functionality)
- **JSON** for shared exercise database

## File Structure

```
/
├── main.py                          # Original Python workout planner
├── exercises.json                   # Root-level exercise database (for Python)
├── CLAUDE.md                       # This documentation file
└── workout-planner/                # Next.js frontend application
    ├── public/
    │   └── exercises/              # Exercise database directory
    │       ├── exercises.json      # Default exercise set
    │       └── exercises-new.json  # Example alternative exercise set
    ├── src/
    │   ├── app/
    │   │   ├── api/
    │   │   │   └── exercises/
    │   │   │       └── route.ts    # API endpoint to list exercise files
    │   │   ├── layout.tsx          # Root layout with theme
    │   │   └── page.tsx            # Main application page with multi-file support
    │   ├── components/
    │   │   ├── ThemeProvider.tsx   # MUI theme wrapper
    │   │   ├── WorkoutPlannerForm.tsx # Input form with exercise set selector
    │   │   └── WorkoutDisplay.tsx  # Workout results display
    │   └── lib/
    │       ├── types.ts            # TypeScript interfaces
    │       ├── theme.ts            # MUI theme configuration
    │       └── workoutPlanner.ts   # Core workout logic
    ├── package.json                # Dependencies and scripts
    └── next.config.ts              # Next.js configuration
```