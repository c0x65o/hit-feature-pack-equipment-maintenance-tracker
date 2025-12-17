// src/server/api/pumps-id.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPumps, equipmentEquipment, equipmentLocations, equipmentPlants } from '@/lib/feature-pack-schemas';
import { eq, and } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/equipment-maintenance-tracker/pumps/{id} -> id is last part
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/equipment-maintenance-tracker/pumps/[id]
 * Get pump with full hierarchy (equipment, location, plant)
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
    
    const [result] = await db
      .select({
        pump: equipmentPumps,
        equipment: equipmentEquipment,
        location: equipmentLocations,
        plant: equipmentPlants,
      })
      .from(equipmentPumps)
      .innerJoin(equipmentEquipment, eq(equipmentPumps.equipmentId, equipmentEquipment.id))
      .innerJoin(equipmentLocations, eq(equipmentEquipment.locationId, equipmentLocations.id))
      .innerJoin(equipmentPlants, eq(equipmentLocations.plantId, equipmentPlants.id))
      .where(eq(equipmentPumps.id, id))
      .limit(1);

    if (!result) {
      return NextResponse.json({ error: 'Pump not found' }, { status: 404 });
    }

    return NextResponse.json({
      pump: result.pump,
      equipment: result.equipment,
      location: result.location,
      plant: result.plant,
    });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Get pump error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pump' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/equipment-maintenance-tracker/pumps/[id]
 * Update pump (admin only)
 */
export async function PATCH(request: NextRequest) {
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

    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    const body = await request.json();

    const [pump] = await db
      .update(equipmentPumps)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(equipmentPumps.id, id))
      .returning();

    if (!pump) {
      return NextResponse.json({ error: 'Pump not found' }, { status: 404 });
    }

    return NextResponse.json(pump);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Update pump error:', error);
    return NextResponse.json(
      { error: 'Failed to update pump' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/equipment-maintenance-tracker/pumps/[id]
 * Delete pump (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    const id = extractId(request);
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDb();
    await db
      .delete(equipmentPumps)
      .where(eq(equipmentPumps.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Delete pump error:', error);
    return NextResponse.json(
      { error: 'Failed to delete pump' },
      { status: 500 }
    );
  }
}

