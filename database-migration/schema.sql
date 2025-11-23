-- Workout Planner Database Schema
-- PostgreSQL

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS PlanDefault CASCADE;
DROP TABLE IF EXISTS ExerciseTag CASCADE;
DROP TABLE IF EXISTS ExercisePlan CASCADE;
DROP TABLE IF EXISTS Tag CASCADE;
DROP TABLE IF EXISTS Plan CASCADE;
DROP TABLE IF EXISTS Exercise CASCADE;

-- Exercise Table: Store core exercise information
CREATE TABLE Exercise (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    notes TEXT,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plan Table: Store workout plan metadata
CREATE TABLE Plan (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tag Table: Store all possible exercise tags
CREATE TABLE Tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ExercisePlan Junction Table: Link exercises to plans
CREATE TABLE ExercisePlan (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL REFERENCES Plan(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES Exercise(id) ON DELETE CASCADE,
    UNIQUE(plan_id, exercise_id)
);

-- ExerciseTag Junction Table: Link exercises to tags
CREATE TABLE ExerciseTag (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER NOT NULL REFERENCES Exercise(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES Tag(id) ON DELETE CASCADE,
    UNIQUE(exercise_id, tag_id)
);

-- PlanDefault Table: Store plan-specific tag-based defaults
CREATE TABLE PlanDefault (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL REFERENCES Plan(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES Tag(id) ON DELETE CASCADE,
    exercises_count INTEGER NOT NULL DEFAULT 1,
    sets_per_exercise INTEGER NOT NULL DEFAULT 1,
    UNIQUE(plan_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_exerciseplan_plan ON ExercisePlan(plan_id);
CREATE INDEX idx_exerciseplan_exercise ON ExercisePlan(exercise_id);
CREATE INDEX idx_exercisetag_exercise ON ExerciseTag(exercise_id);
CREATE INDEX idx_exercisetag_tag ON ExerciseTag(tag_id);
CREATE INDEX idx_plandefault_plan ON PlanDefault(plan_id);
CREATE INDEX idx_plandefault_tag ON PlanDefault(tag_id);
CREATE INDEX idx_tag_name ON Tag(name);

