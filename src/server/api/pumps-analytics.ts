// src/server/api/pumps-analytics.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentActivityLog } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest } from '../auth';
import { calculatePumpAnalytics } from '../lib/analytics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const pumpIndex = parts.indexOf('pumps');
  return pumpIndex >= 0 && pumpIndex + 1 < parts.length ? parts[pumpIndex + 1] : null;
}

/**
 * GET /api/equipment-maintenance-tracker/pumps/[id]/analytics
 * Get pump analytics
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    const logs = await db
      .select()
      .from(equipmentActivityLog)
      .where(eq(equipmentActivityLog.pumpId, id))
      .orderBy(equipmentActivityLog.timestamp);

    const analytics = calculatePumpAnalytics(logs);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Get pump analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate analytics' },
      { status: 500 }
    );
  }
}

