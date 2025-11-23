import { NextResponse } from 'next/server';
import { getPlanTags } from '../../../../db';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ planId: string }> }
) {
	try {
		const { planId } = await params;

		// Convert plan ID (e.g., "main-workout-plan") to plan name
		const planName = planId.split('-').map(word =>
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ');

		const tags = await getPlanTags(planName);

		return NextResponse.json(tags);
	} catch (error) {
		console.error('Error fetching plan tags:', error);
		return NextResponse.json({ error: 'Failed to load plan tags' }, { status: 500 });
	}
}

