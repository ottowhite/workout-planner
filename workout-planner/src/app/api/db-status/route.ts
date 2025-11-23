import { NextResponse } from 'next/server';
import { checkDbConnection } from '../../db';

export async function GET() {
  try {
    const status = await checkDbConnection();
    return NextResponse.json({ status });
  } catch (error) {
    console.error('Database status check failed:', error);
    return NextResponse.json(
      { status: 'Database connection check failed' },
      { status: 500 }
    );
  }
}
