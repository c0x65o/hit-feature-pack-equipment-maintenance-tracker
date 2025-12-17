// src/server/api/settings/diagnostic-findings.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentDiagnosticFindings } from '@/lib/feature-pack-schemas';
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
/**
 * GET /api/equipment-maintenance-tracker/settings/diagnostic-findings
 * List all diagnostic findings
 */
export async function GET(request) {
    try {
        const user = extractUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const db = getDb();
        const findings = await db.select().from(equipmentDiagnosticFindings);
        return NextResponse.json(findings);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] List diagnostic findings error:', error);
        return NextResponse.json({ error: 'Failed to fetch diagnostic findings' }, { status: 500 });
    }
}
/**
 * POST /api/equipment-maintenance-tracker/settings/diagnostic-findings
 * Create diagnostic finding (admin only)
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
        const [finding] = await db
            .insert(equipmentDiagnosticFindings)
            .values({
            ...body,
            createdAt: new Date(),
        })
            .returning();
        return NextResponse.json(finding, { status: 201 });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Create diagnostic finding error:', error);
        return NextResponse.json({ error: 'Failed to create diagnostic finding' }, { status: 500 });
    }
}
/**
 * PUT /api/equipment-maintenance-tracker/settings/diagnostic-findings/[id]
 * Update diagnostic finding (admin only)
 */
export async function PUT(request) {
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
        const [finding] = await db
            .update(equipmentDiagnosticFindings)
            .set(body)
            .where(eq(equipmentDiagnosticFindings.id, id))
            .returning();
        if (!finding) {
            return NextResponse.json({ error: 'Diagnostic finding not found' }, { status: 404 });
        }
        return NextResponse.json(finding);
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Update diagnostic finding error:', error);
        return NextResponse.json({ error: 'Failed to update diagnostic finding' }, { status: 500 });
    }
}
/**
 * DELETE /api/equipment-maintenance-tracker/settings/diagnostic-findings/[id]
 * Delete diagnostic finding (admin only)
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
        await db.delete(equipmentDiagnosticFindings).where(eq(equipmentDiagnosticFindings.id, id));
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error('[equipment-maintenance-tracker] Delete diagnostic finding error:', error);
        return NextResponse.json({ error: 'Failed to delete diagnostic finding' }, { status: 500 });
    }
}
