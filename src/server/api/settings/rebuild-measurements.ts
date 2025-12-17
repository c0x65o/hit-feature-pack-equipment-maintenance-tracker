// src/server/api/settings/rebuild-measurements.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentRebuildMeasurements } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../../auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): number | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr, 10);
  return isNaN(id) ? null : id;
}

export async function GET(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = getDb();
    const measurements = await db.select().from(equipmentRebuildMeasurements);
    return NextResponse.json(measurements);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] List rebuild measurements error:', error);
    return NextResponse.json({ error: 'Failed to fetch rebuild measurements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const db = getDb();
    const body = await request.json();
    const [measurement] = await db.insert(equipmentRebuildMeasurements).values({ ...body, createdAt: new Date() }).returning();
    return NextResponse.json(measurement, { status: 201 });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Create rebuild measurement error:', error);
    return NextResponse.json({ error: 'Failed to create rebuild measurement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const id = extractId(request);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const db = getDb();
    const body = await request.json();
    const [measurement] = await db.update(equipmentRebuildMeasurements).set(body).where(eq(equipmentRebuildMeasurements.id, id)).returning();
    if (!measurement) return NextResponse.json({ error: 'Rebuild measurement not found' }, { status: 404 });
    return NextResponse.json(measurement);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Update rebuild measurement error:', error);
    return NextResponse.json({ error: 'Failed to update rebuild measurement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const id = extractId(request);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const db = getDb();
    await db.delete(equipmentRebuildMeasurements).where(eq(equipmentRebuildMeasurements.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Delete rebuild measurement error:', error);
    return NextResponse.json({ error: 'Failed to delete rebuild measurement' }, { status: 500 });
  }
}

