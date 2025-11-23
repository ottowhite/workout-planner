import { neon } from "@neondatabase/serverless";


export async function checkDbConnection() {
	if (!process.env.DATABASE_URL) {
		return "Database not configured (no DATABASE_URL)";
	}
	try {
		const sql = neon(process.env.DATABASE_URL);
		const result = await sql`SELECT version()`;
		console.log("Pg version:", result);
		return "Database connected";
	} catch (error) {
		console.error("Error connecting to the database:", error);
		return "Database not connected";
	}
}