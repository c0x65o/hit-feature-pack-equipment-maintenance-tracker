// src/server/api/locations.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentLocations } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  return parts[parts.length - 1] || null;
}

/**
 * GET /api/equipment-maintenance-tracker/locations
 * List all locations
 */
export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    const locations = await db.select().from(equipmentLocations);
    return NextResponse.json(locations);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] List locations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/equipment-maintenance-tracker/locations
 * Create a new location (admin only)
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

    const [location] = await db
      .insert(equipmentLocations)
      .values({
        ...body,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Create location error:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 400 }
    );
  }
}

/**
 * PATCH /api/equipment-maintenance-tracker/locations/[id]
 * Update location (admin only)
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

    const [location] = await db
      .update(equipmentLocations)
      .set(body)
      .where(eq(equipmentLocations.id, id))
      .returning();

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Update location error:', error);
    return NextResponse.json(
      { error: 'Failed to update location' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/equipment-maintenance-tracker/locations/[id]
 * Delete location (admin only)
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
    await db.delete(equipmentLocations).where(eq(equipmentLocations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Delete location error:', error);
    return NextResponse.json(
      { error: 'Failed to delete location' },
      { status: 400 }
    );
  }
}

