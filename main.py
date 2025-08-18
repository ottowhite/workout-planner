import json
import random
from typing import List, Dict, Any
from collections import defaultdict

class WorkoutPlanner:
    def __init__(self, exercises_file: str = "exercises.json"):
        """Initialize the workout planner with exercises from JSON file."""
        with open(exercises_file, 'r') as f:
            self.exercises = json.load(f)["exercises"]
    
    def generate_workout(self, 
                        duration_minutes: int, 
                        muscle_groups: List[str], 
                        time_split: Dict[str, float]) -> Dict[str, Any]:
        """
        Generate a workout based on input parameters.
        
        Args:
            duration_minutes: Total workout duration in minutes
            muscle_groups: List of muscle groups to target
            time_split: Dictionary mapping muscle groups to time allocation percentages
        
        Returns:
            Dictionary containing the complete workout plan
        """
        # Validate time split adds up to 1.0
        if abs(sum(time_split.values()) - 1.0) > 0.01:
            raise ValueError("Time split percentages must sum to 1.0")
        
        # Reserve 10 minutes for warmup (5 min cardio + 5 min stretching)
        warmup_time = 10
        exercise_time = duration_minutes - warmup_time
        
        workout = {
            "total_duration": duration_minutes,
            "warmup": {
                "cardio": {"duration": 5, "activity": "Light cardio (jogging in place, jumping jacks)"},
                "stretching": {"duration": 5, "activity": "Dynamic stretching (arm circles, leg swings, hip circles)"}
            },
            "exercises": [],
            "summary": {}
        }
        
        # Calculate time allocation for each muscle group
        time_allocation = {}
        for group in muscle_groups:
            if group not in time_split:
                raise ValueError(f"Time split not specified for muscle group: {group}")
            time_allocation[group] = exercise_time * time_split[group]
        
        # Generate exercises for each muscle group (organized by sections)
        for muscle_group, allocated_time in time_allocation.items():
            group_exercises = self._select_exercises_for_group(muscle_group, allocated_time)
            workout["exercises"].extend(group_exercises)
        
        # Do not shuffle exercises to prevent interleaving between muscle groups
        
        # Calculate summary
        workout["summary"] = self._calculate_summary(workout)
        
        return workout
    
    def _select_exercises_for_group(self, muscle_group: str, allocated_time: float) -> List[Dict[str, Any]]:
        """Select exercises for a specific muscle group within the allocated time."""
        # Find exercises that target this muscle group
        suitable_exercises = [
            ex for ex in self.exercises 
            if muscle_group.lower() in [tag.lower() for tag in ex["tags"]]
        ]
        
        if not suitable_exercises:
            raise ValueError(f"No exercises found for muscle group: {muscle_group}")
        
        selected_exercises = []
        remaining_time = allocated_time * 60  # Convert to seconds
        
        while remaining_time > 30:  # Minimum 30 seconds for an exercise
            # Randomly select an exercise
            exercise = random.choice(suitable_exercises)
            
            # Calculate how many sets we can fit
            try:
                set_time = exercise["set_duration_sec"] + exercise["rest_duration_sec"]
            except:
                print(exercise)
                raise ValueError("Exercise has no set or rest duration")

            max_sets = int(remaining_time // set_time)
            
            if max_sets < 3:
                break
            
            # Use 3-5 sets with minimum of 3, but not more than what fits in time
            num_sets = min(random.randint(3, 5), max_sets)
            
            exercise_block = {
                "name": exercise["name"],
                "sets": num_sets,
                "set_duration_sec": exercise["set_duration_sec"],
                "rest_duration_sec": exercise["rest_duration_sec"],
                "total_time": num_sets * set_time,
                "muscle_group": muscle_group,
                "notes": exercise.get("notes", ""),
                "link": exercise.get("link", "")
            }
            
            selected_exercises.append(exercise_block)
            remaining_time -= exercise_block["total_time"]
        
        return selected_exercises
    
    def _calculate_summary(self, workout: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate workout summary statistics."""
        total_exercise_time = sum(ex["total_time"] for ex in workout["exercises"])
        total_sets = sum(ex["sets"] for ex in workout["exercises"])
        
        muscle_groups = defaultdict(int)
        for ex in workout["exercises"]:
            muscle_groups[ex["muscle_group"]] += ex["total_time"]
        
        return {
            "total_exercise_time_seconds": total_exercise_time,
            "total_exercise_time_minutes": round(total_exercise_time / 60, 1),
            "total_sets": total_sets,
            "muscle_group_breakdown": dict(muscle_groups),
            "exercises_count": len(workout["exercises"])
        }
    
    def print_workout(self, workout: Dict[str, Any]) -> None:
        """Print the workout in a readable format."""
        print("🏋️‍♀️ WORKOUT PLAN 🏋️‍♂️")
        print("=" * 50)
        print(f"Total Duration: {workout['total_duration']} minutes")
        print()
        
        # Warmup
        print("🔥 WARMUP (10 minutes)")
        print("-" * 30)
        print(f"• Cardio: {workout['warmup']['cardio']['duration']} minutes")
        print(f"  {workout['warmup']['cardio']['activity']}")
        print(f"• Dynamic Stretching: {workout['warmup']['stretching']['duration']} minutes")
        print(f"  {workout['warmup']['stretching']['activity']}")
        print()
        
        # Main exercises
        print("💪 MAIN EXERCISES")
        print("-" * 30)
        for i, exercise in enumerate(workout["exercises"], 1):
            print(f"{i}. {exercise['name']} ({exercise['muscle_group'].upper()})")
            print(f"   Sets: {exercise['sets']}")
            print(f"   Work: {exercise['set_duration_sec']}s | Rest: {exercise['rest_duration_sec']}s")
            print(f"   Total time: {exercise['total_time']}s ({round(exercise['total_time']/60, 1)} min)")
            
            if exercise['notes']:
                print(f"   Notes: {exercise['notes']}")
            if exercise['link']:
                print(f"   Video: {exercise['link']}")
            print()
        
        # Summary
        print("📊 WORKOUT SUMMARY")
        print("-" * 30)
        summary = workout["summary"]
        print(f"Total exercises: {summary['exercises_count']}")
        print(f"Total sets: {summary['total_sets']}")
        print(f"Exercise time: {summary['total_exercise_time_minutes']} minutes")
        print()
        print("Muscle group breakdown:")
        for group, time_seconds in summary['muscle_group_breakdown'].items():
            print(f"  • {group.title()}: {round(time_seconds/60, 1)} minutes")

# TODO: Split exercises into multiple different files for the different kinds
# TODO: Add a frontend that I can use to customise the workout
# TODO: Add a hierarchy of tags such that we can simplify tag maintenance
# TODO: Add exercise progressions
# TODO: Add a mode of selecting exercises based on only muscle groups and not time.
# TODO: Add supersets functionality
# TODO: Add more nuance to how we pick the specific exercises
# TODO: Add support for wanting to do specific exercises

def main():
    """Example usage of the workout planner."""
    planner = WorkoutPlanner()
    
    # Example workout parameters
    duration = 30  # 30 minute workout
    time_split = {
        "glutes": 0.3,
        "rear delts": 0.3,
        "chest": 0.4,
    }
    muscle_groups = list(time_split.keys())
    
    print("Generating workout with the following parameters:")
    print(f"Duration: {duration} minutes")
    print(f"Muscle groups: {muscle_groups}")
    print(f"Time split: {time_split}")
    print()
    
    workout = planner.generate_workout(duration, muscle_groups, time_split)
    planner.print_workout(workout)


if __name__ == "__main__":
    main()
