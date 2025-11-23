#!/usr/bin/env python3
"""
Generate seed.sql from JSON exercise files
"""
import json
import sys

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

def main():
    # Read both JSON files
    with open('workout-planner/public/exercises/exercises.json', 'r') as f:
        exercises_data = json.load(f)
    
    with open('workout-planner/public/exercises/atomic-rehab.json', 'r') as f:
        atomic_rehab_data = json.load(f)
    
    # Collect all unique tags
    all_tags = set()
    
    # Collect all exercises with their tags and which plans they belong to
    exercises_map = {}  # name -> {notes, link, tags, plans}
    
    # Process exercises.json
    for ex in exercises_data.get('exercises', []):
        name = ex['name']
        exercises_map[name] = {
            'notes': ex.get('notes'),
            'link': ex.get('link'),
            'tags': ex.get('tags', []),
            'plans': ['Main Workout Plan']
        }
        all_tags.update(ex.get('tags', []))
    
    # Process atomic-rehab.json (merge or add new)
    for ex in atomic_rehab_data.get('exercises', []):
        name = ex['name']
        if name not in exercises_map:
            exercises_map[name] = {
                'notes': ex.get('notes'),
                'link': ex.get('link'),
                'tags': ex.get('tags', []),
                'plans': ['Atomic Rehab Plan']
            }
        else:
            # Exercise exists in both, add to both plans
            exercises_map[name]['plans'].append('Atomic Rehab Plan')
        all_tags.update(ex.get('tags', []))
    
    # Sort for consistency
    all_tags = sorted(all_tags)
    exercise_names = sorted(exercises_map.keys())
    
    # Generate SQL
    sql_lines = []
    sql_lines.append("-- Workout Planner Seed Data")
    sql_lines.append("-- Generated from JSON exercise files\n")
    
    # Insert Tags
    sql_lines.append("-- Insert Tags")
    for tag in all_tags:
        sql_lines.append(f"INSERT INTO Tag (name) VALUES ({escape_sql_string(tag)});")
    
    sql_lines.append("\n-- Insert Exercises")
    for name in exercise_names:
        ex = exercises_map[name]
        notes = escape_sql_string(ex['notes'])
        link = escape_sql_string(ex['link'])
        sql_lines.append(f"INSERT INTO Exercise (name, notes, link) VALUES ({escape_sql_string(name)}, {notes}, {link});")
    
    sql_lines.append("\n-- Insert ExerciseTag relationships")
    for name in exercise_names:
        ex = exercises_map[name]
        for tag in ex['tags']:
            sql_lines.append(
                f"INSERT INTO ExerciseTag (exercise_id, tag_id) "
                f"SELECT e.id, t.id FROM Exercise e, Tag t "
                f"WHERE e.name = {escape_sql_string(name)} AND t.name = {escape_sql_string(tag)};"
            )
    
    # Create sample plans from defaults
    sql_lines.append("\n-- Create sample plans")
    
    # Plan 1: From exercises.json defaults
    sql_lines.append("INSERT INTO Plan (name, description) VALUES ('Main Workout Plan', 'Default workout plan from exercises.json');")
    
    if 'defaults' in exercises_data and 'muscle_groups' in exercises_data['defaults']:
        sql_lines.append("\n-- Plan defaults for Main Workout Plan")
        for mg in exercises_data['defaults']['muscle_groups']:
            muscle_group = mg['muscle_group']
            exercises_count = mg['exercises_count']
            sets_per_exercise = mg['sets_per_exercise']
            sql_lines.append(
                f"INSERT INTO PlanDefault (plan_id, tag_id, exercises_count, sets_per_exercise) "
                f"SELECT p.id, t.id, {exercises_count}, {sets_per_exercise} FROM Plan p, Tag t "
                f"WHERE p.name = 'Main Workout Plan' AND t.name = {escape_sql_string(muscle_group)};"
            )
    
    # Plan 2: From atomic-rehab.json defaults
    sql_lines.append("\nINSERT INTO Plan (name, description) VALUES ('Atomic Rehab Plan', 'Rehabilitation workout plan from atomic-rehab.json');")
    
    if 'defaults' in atomic_rehab_data and 'muscle_groups' in atomic_rehab_data['defaults']:
        sql_lines.append("\n-- Plan defaults for Atomic Rehab Plan")
        for mg in atomic_rehab_data['defaults']['muscle_groups']:
            muscle_group = mg['muscle_group']
            exercises_count = mg['exercises_count']
            sets_per_exercise = mg['sets_per_exercise']
            sql_lines.append(
                f"INSERT INTO PlanDefault (plan_id, tag_id, exercises_count, sets_per_exercise) "
                f"SELECT p.id, t.id, {exercises_count}, {sets_per_exercise} FROM Plan p, Tag t "
                f"WHERE p.name = 'Atomic Rehab Plan' AND t.name = {escape_sql_string(muscle_group)};"
            )
    
    # Insert ExercisePlan relationships AFTER plans are created
    sql_lines.append("\n-- Insert ExercisePlan relationships")
    for name in exercise_names:
        ex = exercises_map[name]
        for plan_name in ex['plans']:
            sql_lines.append(
                f"INSERT INTO ExercisePlan (plan_id, exercise_id) "
                f"SELECT p.id, e.id FROM Plan p, Exercise e "
                f"WHERE p.name = {escape_sql_string(plan_name)} AND e.name = {escape_sql_string(name)};"
            )
    
    # Write to file
    with open('seed.sql', 'w') as f:
        f.write('\n'.join(sql_lines))
        f.write('\n')
    
    # Count exercise-plan relationships
    total_relationships = sum(len(ex['plans']) for ex in exercises_map.values())
    
    print(f"Generated seed.sql with:")
    print(f"  - {len(all_tags)} tags")
    print(f"  - {len(exercise_names)} exercises")
    print(f"  - 2 plans")
    print(f"  - {total_relationships} exercise-plan relationships")

if __name__ == '__main__':
    main()

