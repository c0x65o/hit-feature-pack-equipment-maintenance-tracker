// src/server/api/activity-logs.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentActivityLog } from '@/lib/feature-pack-schemas';
import { eq, desc } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/equipment-maintenance-tracker/activity-logs
 * Get all activity logs (admin only) or logs for a specific pump
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);
    const pumpId = searchParams.get('pumpId');

    if (pumpId) {
      // Get logs for specific pump
      const logs = await db
        .select()
        .from(equipmentActivityLog)
        .where(eq(equipmentActivityLog.pumpId, pumpId))
        .orderBy(desc(equipmentActivityLog.timestamp));

      return NextResponse.json(logs);
    } else {
      // Get all logs (admin only)
      const config = getFeaturePackConfig(request);
      const isAdmin = config.support_additional_roles
        ? user.roles?.includes('Admin') || user.roles?.includes('admin')
        : user.roles?.includes('admin');

      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const logs = await db
        .select()
        .from(equipmentActivityLog)
        .orderBy(desc(equipmentActivityLog.timestamp));

      return NextResponse.json(logs);
    }
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Get activity logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

