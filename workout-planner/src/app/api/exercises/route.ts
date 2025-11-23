import { NextResponse } from 'next/server';
import { getAllPlanNames } from '../../db';

export async function GET() {
  try {
    const planNames = await getAllPlanNames();

    // Convert plan names to the format expected by the frontend
    const plans = planNames.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      filename: name.toLowerCase().replace(/\s+/g, '-') + '.json'
    }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching plans from database:', error);
    return NextResponse.json({ error: 'Failed to load plans' }, { status: 500 });
  }
}
