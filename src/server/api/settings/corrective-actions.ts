// src/server/api/settings/corrective-actions.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentCorrectiveActions } from '@/lib/feature-pack-schemas';
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
    const actions = await db.select().from(equipmentCorrectiveActions);
    return NextResponse.json(actions);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] List corrective actions error:', error);
    return NextResponse.json({ error: 'Failed to fetch corrective actions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles
      ? user.roles?.includes('Admin') || user.roles?.includes('admin')
      : user.roles?.includes('admin');

    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const db = getDb();
    const body = await request.json();
    const [action] = await db.insert(equipmentCorrectiveActions).values({ ...body, createdAt: new Date() }).returning();
    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Create corrective action error:', error);
    return NextResponse.json({ error: 'Failed to create corrective action' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles
      ? user.roles?.includes('Admin') || user.roles?.includes('admin')
      : user.roles?.includes('admin');

    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const id = extractId(request);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    const body = await request.json();
    const [action] = await db.update(equipmentCorrectiveActions).set(body).where(eq(equipmentCorrectiveActions.id, id)).returning();
    if (!action) return NextResponse.json({ error: 'Corrective action not found' }, { status: 404 });
    return NextResponse.json(action);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Update corrective action error:', error);
    return NextResponse.json({ error: 'Failed to update corrective action' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = extractUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const config = getFeaturePackConfig(request);
    const isAdmin = config.support_additional_roles
      ? user.roles?.includes('Admin') || user.roles?.includes('admin')
      : user.roles?.includes('admin');

    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const id = extractId(request);
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db = getDb();
    await db.delete(equipmentCorrectiveActions).where(eq(equipmentCorrectiveActions.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Delete corrective action error:', error);
    return NextResponse.json({ error: 'Failed to delete corrective action' }, { status: 500 });
  }
}

