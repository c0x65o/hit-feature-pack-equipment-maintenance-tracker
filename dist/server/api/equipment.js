// src/server/api/equipment.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentEquipment } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function extractId(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    return parts[parts.length - 1] || null;
}
/**
 * GET /api/equipment-maintenance-tracker/equipment
 * List all equipment
 */
export async function GET(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getDb();
        const equipment = await db.select().from(equipmentEquipment);
        return NextResponse.json(equipment);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] List equipment error:', error);
        return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
    }
}
/**
 * POST /api/equipment-maintenance-tracker/equipment
 * Create new equipment (admin only)
 */
export async function POST(request) {
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
        const [equipment] = await db
            .insert(equipmentEquipment)
            .values({
            ...body,
            createdAt: new Date(),
        })
            .returning();
        return NextResponse.json(equipment, { status: 201 });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Create equipment error:', error);
        return NextResponse.json({ error: 'Failed to create equipment' }, { status: 400 });
    }
}
/**
 * PATCH /api/equipment-maintenance-tracker/equipment/[id]
 * Update equipment (admin only)
 */
export async function PATCH(request) {
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
        const [equipment] = await db
            .update(equipmentEquipment)
            .set(body)
            .where(eq(equipmentEquipment.id, id))
            .returning();
        if (!equipment) {
            return NextResponse.json({ error: 'Equipment not found' }, { status: 404 });
        }
        return NextResponse.json(equipment);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Update equipment error:', error);
        return NextResponse.json({ error: 'Failed to update equipment' }, { status: 400 });
    }
}
/**
 * DELETE /api/equipment-maintenance-tracker/equipment/[id]
 * Delete equipment (admin only)
 */
export async function DELETE(request) {
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
        await db.delete(equipmentEquipment).where(eq(equipmentEquipment.id, id));
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Delete equipment error:', error);
        return NextResponse.json({ error: 'Failed to delete equipment' }, { status: 400 });
    }
}
