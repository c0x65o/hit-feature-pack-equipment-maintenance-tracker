// src/server/api/plants.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPlants } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * GET /api/equipment-maintenance-tracker/plants
 * List all plants
 */
export async function GET(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getDb();
        const plants = await db.select().from(equipmentPlants);
        return NextResponse.json(plants);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] List plants error:', error);
        return NextResponse.json({ error: 'Failed to fetch plants' }, { status: 500 });
    }
}
/**
 * POST /api/equipment-maintenance-tracker/plants
 * Create a new plant (admin only)
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
        const [plant] = await db
            .insert(equipmentPlants)
            .values({
            ...body,
            createdAt: new Date(),
        })
            .returning();
        return NextResponse.json(plant, { status: 201 });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Create plant error:', error);
        return NextResponse.json({ error: 'Failed to create plant' }, { status: 400 });
    }
}
/**
 * PATCH /api/equipment-maintenance-tracker/plants/[id]
 * Update plant (admin only)
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
        const url = new URL(request.url);
        const parts = url.pathname.split('/');
        const id = parts[parts.length - 1];
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        const db = getDb();
        const body = await request.json();
        const [plant] = await db
            .update(equipmentPlants)
            .set(body)
            .where(eq(equipmentPlants.id, id))
            .returning();
        if (!plant) {
            return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
        }
        return NextResponse.json(plant);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Update plant error:', error);
        return NextResponse.json({ error: 'Failed to update plant' }, { status: 400 });
    }
}
