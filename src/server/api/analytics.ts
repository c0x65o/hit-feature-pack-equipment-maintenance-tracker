// src/server/api/analytics.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPumps, equipmentEquipment, equipmentLocations, equipmentActivityLog } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig, canViewAnalytics } from '../auth';
import { calculatePlantAnalytics } from '../lib/analytics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/equipment-maintenance-tracker/analytics/plant
 * Get plant-wide analytics
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = getFeaturePackConfig(request);
    if (!canViewAnalytics(user, config)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    
    // Get all pumps with details
    const pumpsWithDetails = await db
      .select({
        pump: equipmentPumps,
        equipmentName: equipmentEquipment.name,
        equipmentCustomId: equipmentEquipment.equipmentId,
        locationName: equipmentLocations.name,
      })
      .from(equipmentPumps)
      .innerJoin(equipmentEquipment, eq(equipmentPumps.equipmentId, equipmentEquipment.id))
      .innerJoin(equipmentLocations, eq(equipmentEquipment.locationId, equipmentLocations.id));

    // Map to format expected by analytics
    const pumps = pumpsWithDetails.map((row: any) => ({
      ...row.pump,
      equipmentName: row.equipmentName,
      equipmentCustomId: row.equipmentCustomId,
      locationName: row.locationName,
    }));

    // Get all activity logs
    const allLogs = await db.select().from(equipmentActivityLog);

    const analytics = calculatePlantAnalytics(pumps, allLogs);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Get plant analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate plant analytics' },
      { status: 500 }
    );
  }
}

