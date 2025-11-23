import { neon } from "@neondatabase/serverless";

function getSql() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set");
	}
	return neon(process.env.DATABASE_URL);
}

export async function checkDbConnection() {
	if (!process.env.DATABASE_URL) {
		return "Database not configured (no DATABASE_URL)";
	}
	try {
		const sql = getSql();
		const result = await sql`SELECT version()`;
		console.log("Pg version:", result);
		return "Database connected";
	} catch (error) {
		console.error("Error connecting to the database:", error);
		return "Database not connected";
	}
}

// Get all plan names
export async function getAllPlanNames(): Promise<string[]> {
	const sql = getSql();
	const result = await sql`SELECT name FROM Plan ORDER BY name`;
	return result.map((row) => row.name as string);
}

// Get all tags associated with a plan's exercises
export async function getPlanTags(planName: string): Promise<string[]> {
	const sql = getSql();
	const result = await sql`
		SELECT DISTINCT t.name
		FROM Tag t
		JOIN ExerciseTag et ON t.id = et.tag_id
		JOIN Exercise e ON et.exercise_id = e.id
		JOIN ExercisePlan ep ON e.id = ep.exercise_id
		JOIN Plan p ON ep.plan_id = p.id
		WHERE p.name = ${planName}
		ORDER BY t.name
	`;
	return result.map((row) => row.name as string);
}

// Get default exercise counts and sets per tag for a plan
export async function getPlanDefaults(planName: string): Promise<Array<{
	tag: string;
	exercises_count: number;
	sets_per_exercise: number;
}>> {
	const sql = getSql();
	const result = await sql`
		SELECT t.name as tag, pd.exercises_count, pd.sets_per_exercise
		FROM PlanDefault pd
		JOIN Plan p ON pd.plan_id = p.id
		JOIN Tag t ON pd.tag_id = t.id
		WHERE p.name = ${planName}
		ORDER BY t.name
	`;
	return result.map((row) => ({
		tag: row.tag as string,
		exercises_count: row.exercises_count as number,
		sets_per_exercise: row.sets_per_exercise as number,
	}));
}

// Get all exercises that have a specific tag
export async function getExercisesByTag(tagName: string): Promise<Array<{
	name: string;
	notes: string | null;
	link: string | null;
}>> {
	const sql = getSql();
	const result = await sql`
		SELECT e.name, e.notes, e.link
		FROM Exercise e
		JOIN ExerciseTag et ON e.id = et.exercise_id
		JOIN Tag t ON et.tag_id = t.id
		WHERE t.name = ${tagName}
		ORDER BY e.name
	`;
	return result.map((row) => ({
		name: row.name as string,
		notes: row.notes as string | null,
		link: row.link as string | null,
	}));
}

// Get complete plan data including exercises with tags and defaults
export async function getPlanData(planName: string): Promise<{
	exercises: Array<{
		name: string;
		notes: string | null;
		link: string | null;
		tags: string[];
	}>;
	defaults?: {
		muscle_groups: Array<{
			muscle_group: string;
			exercises_count: number;
			sets_per_exercise: number;
		}>;
	};
}> {
	const sql = getSql();

	// Get all exercises for this plan with their tags
	const exercises = await sql`
		SELECT 
			e.id,
			e.name,
			e.notes,
			e.link,
			COALESCE(
				array_agg(DISTINCT t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL),
				ARRAY[]::text[]
			) as tags
		FROM Exercise e
		JOIN ExercisePlan ep ON e.id = ep.exercise_id
		JOIN Plan p ON ep.plan_id = p.id
		LEFT JOIN ExerciseTag et ON e.id = et.exercise_id
		LEFT JOIN Tag t ON et.tag_id = t.id
		WHERE p.name = ${planName}
		GROUP BY e.id, e.name, e.notes, e.link
		ORDER BY e.name
	`;

	// Get plan defaults
	const defaults = await sql`
		SELECT t.name as muscle_group, pd.exercises_count, pd.sets_per_exercise
		FROM PlanDefault pd
		JOIN Plan p ON pd.plan_id = p.id
		JOIN Tag t ON pd.tag_id = t.id
		WHERE p.name = ${planName}
		ORDER BY t.name
	`;

	return {
		exercises: exercises.map(ex => ({
			name: ex.name as string,
			notes: ex.notes as string | null,
			link: ex.link as string | null,
			tags: Array.isArray(ex.tags) ? ex.tags : []
		})),
		defaults: defaults.length > 0 ? {
			muscle_groups: defaults.map(d => ({
				muscle_group: d.muscle_group as string,
				exercises_count: d.exercises_count as number,
				sets_per_exercise: d.sets_per_exercise as number
			}))
		} : undefined
	};
}