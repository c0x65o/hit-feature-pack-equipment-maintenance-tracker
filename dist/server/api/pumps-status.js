// src/server/api/pumps-status.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPumps, equipmentActivityLog } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';
import { validateStatusTransition, validateRoleForStatusChange } from '../lib/workflow-validator';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
function extractId(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    // /api/equipment-maintenance-tracker/pumps/{id}/status -> id is second to last
    const pumpIndex = parts.indexOf('pumps');
    return pumpIndex >= 0 && pumpIndex + 1 < parts.length ? parts[pumpIndex + 1] : null;
}
/**
 * POST /api/equipment-maintenance-tracker/pumps/[id]/status
 * Update pump status
 */
export async function POST(request) {
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
        const body = await request.json();
        const { newStatus, notes, equipmentId } = body;
        if (!newStatus) {
            return NextResponse.json({ error: 'Missing newStatus' }, { status: 400 });
        }
        // Get current pump
        const [pump] = await db
            .select()
            .from(equipmentPumps)
            .where(eq(equipmentPumps.id, id))
            .limit(1);
        if (!pump) {
            return NextResponse.json({ error: 'Pump not found' }, { status: 404 });
        }
        const currentStatus = pump.status;
        const config = getFeaturePackConfig(request);
        // Get user role (from JWT or default)
        const userRole = user.roles?.[0] || 'user';
        // If status is not changing, just log the notes
        if (currentStatus === newStatus) {
            await db.insert(equipmentActivityLog).values({
                pumpId: id,
                userId: user.sub,
                userName: user.email || user.sub,
                userRole,
                action: 'Rebuild draft saved',
                oldStatus: currentStatus,
                newStatus: currentStatus,
                notes: notes || '',
                timestamp: new Date(),
            });
            const [updatedPump] = await db
                .update(equipmentPumps)
                .set({ updatedAt: new Date() })
                .where(eq(equipmentPumps.id, id))
                .returning();
            return NextResponse.json(updatedPump);
        }
        // Validate status transition
        const transitionValidation = validateStatusTransition(currentStatus, newStatus);
        if (!transitionValidation.valid) {
            return NextResponse.json({ error: transitionValidation.error }, { status: 400 });
        }
        // Validate role permissions
        const roleValidation = validateRoleForStatusChange(userRole, currentStatus, newStatus, config);
        if (!roleValidation.valid) {
            return NextResponse.json({ error: roleValidation.error }, { status: 403 });
        }
        // Prepare update data
        const updateData = {
            status: newStatus,
            updatedAt: new Date(),
        };
        // Handle equipment assignment on dispatch
        if (equipmentId && currentStatus === 'In Inventory' && newStatus === 'Awaiting Install') {
            updateData.equipmentId = equipmentId;
        }
        // Update fields based on transitions
        if (currentStatus === 'Awaiting Install' && newStatus === 'In Service') {
            updateData.lastMaintenanceDate = new Date();
        }
        else if (currentStatus === 'Awaiting Rebuild' && newStatus === 'Awaiting Wet End Install') {
            updateData.totalRebuilds = (pump.totalRebuilds || 0) + 1;
            updateData.lastMaintenanceDate = new Date();
        }
        else if (currentStatus === 'Awaiting Wet End Install' && newStatus === 'In Inventory') {
            updateData.lastMaintenanceDate = new Date();
        }
        // Update pump
        const [updatedPump] = await db
            .update(equipmentPumps)
            .set(updateData)
            .where(eq(equipmentPumps.id, id))
            .returning();
        // Log activity
        await db.insert(equipmentActivityLog).values({
            pumpId: id,
            userId: user.sub,
            userName: user.email || user.sub,
            userRole,
            action: `Status changed to ${newStatus}`,
            oldStatus: currentStatus,
            newStatus: newStatus,
            notes: notes || '',
            timestamp: new Date(),
        });
        return NextResponse.json(updatedPump);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Update pump status error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to update pump status';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
