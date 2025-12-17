// src/server/api/pumps.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPumps, equipmentEquipment, equipmentLocations, equipmentPlants } from '@/lib/feature-pack-schemas';
import { eq, desc, ilike, and } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/equipment-maintenance-tracker/pumps
 * List all pumps or search pumps
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (q && typeof q === 'string') {
      // Search pumps
      const pumps = await db
        .select()
        .from(equipmentPumps)
        .where(ilike(equipmentPumps.id, `%${q}%`))
        .limit(10);

      return NextResponse.json(pumps);
    } else {
      // Get all pumps
      const pumps = await db
        .select()
        .from(equipmentPumps)
        .orderBy(desc(equipmentPumps.createdAt));

      return NextResponse.json(pumps);
    }
  } catch (error) {
    console.error('[equipment-maintenance-tracker] List pumps error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pumps' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/equipment-maintenance-tracker/pumps
 * Create a new pump
 */
export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles
      ? user.roles?.includes('Admin') || user.roles?.includes('admin')
      : user.roles?.includes('admin');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getDb();
    const body = await request.json();

    const [pump] = await db
      .insert(equipmentPumps)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(pump, { status: 201 });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Create pump error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create pump';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

