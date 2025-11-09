import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const exercisesDir = path.join(process.cwd(), 'public', 'exercises');
    const files = fs.readdirSync(exercisesDir);

    // Filter for JSON files only
    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        id: file.replace('.json', ''),
        name: file.replace('.json', '').split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        filename: file
      }));

    return NextResponse.json(jsonFiles);
  } catch (error) {
    console.error('Error reading exercise files:', error);
    return NextResponse.json({ error: 'Failed to load exercise files' }, { status: 500 });
  }
}
