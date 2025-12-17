// src/server/api/settings/measurement-fields.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentMeasurementFields } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function extractId(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    const idStr = parts[parts.length - 1];
    const id = parseInt(idStr, 10);
    return isNaN(id) ? null : id;
}
export async function GET(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const db = getDb();
        const fields = await db.select().from(equipmentMeasurementFields);
        return NextResponse.json(fields);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] List measurement fields error:', error);
        return NextResponse.json({ error: 'Failed to fetch measurement fields' }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const config = getFeaturePackConfig(request);
        const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
        if (!isAdmin)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const db = getDb();
        const body = await request.json();
        const [field] = await db.insert(equipmentMeasurementFields).values({ ...body, createdAt: new Date() }).returning();
        return NextResponse.json(field, { status: 201 });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Create measurement field error:', error);
        return NextResponse.json({ error: 'Failed to create measurement field' }, { status: 500 });
    }
}
export async function PUT(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const config = getFeaturePackConfig(request);
        const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
        if (!isAdmin)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const id = extractId(request);
        if (!id)
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const db = getDb();
        const body = await request.json();
        const [field] = await db.update(equipmentMeasurementFields).set(body).where(eq(equipmentMeasurementFields.id, id)).returning();
        if (!field)
            return NextResponse.json({ error: 'Measurement field not found' }, { status: 404 });
        return NextResponse.json(field);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Update measurement field error:', error);
        return NextResponse.json({ error: 'Failed to update measurement field' }, { status: 500 });
    }
}
export async function DELETE(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const config = getFeaturePackConfig(request);
        const isAdmin = config.support_additional_roles ? user.roles?.includes('Admin') || user.roles?.includes('admin') : user.roles?.includes('admin');
        if (!isAdmin)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        const id = extractId(request);
        if (!id)
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const db = getDb();
        await db.delete(equipmentMeasurementFields).where(eq(equipmentMeasurementFields.id, id));
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Delete measurement field error:', error);
        return NextResponse.json({ error: 'Failed to delete measurement field' }, { status: 500 });
    }
}
