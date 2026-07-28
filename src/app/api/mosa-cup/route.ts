import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/redis';

export async function GET() {
  try {
    const data = await getCache('mosa_cup_state');
    return NextResponse.json(data || {});
  } catch (error) {
    console.error('GET mosa-cup error:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate we have the required top level keys, or just store the whole JSON blob
    const dataToSave = {
      scores: body.scores || {},
      goals: body.goals || {},
      attendance: body.attendance || {},
      awards: body.awards || {},
      timer: body.timer || {},
      allStarSquad: body.allStarSquad || [],
      lastUpdated: new Date().toISOString()
    };
    
    // Store in redis with 14 days expiration (sufficient for a 4 day tournament)
    await setCache('mosa_cup_state', dataToSave, 60 * 60 * 24 * 14);
    
    return NextResponse.json({ success: true, updated: dataToSave.lastUpdated });
  } catch (error) {
    console.error('POST mosa-cup error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
