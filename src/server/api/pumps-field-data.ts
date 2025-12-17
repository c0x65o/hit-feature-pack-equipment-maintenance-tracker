// src/server/api/pumps-field-data.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { equipmentPumps, equipmentActivityLog } from '@/lib/feature-pack-schemas';
import { eq } from 'drizzle-orm';
import { extractUserFromRequest, getFeaturePackConfig } from '../auth';
import { validateRoleForFieldData } from '../lib/workflow-validator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function extractId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const pumpIndex = parts.indexOf('pumps');
  return pumpIndex >= 0 && pumpIndex + 1 < parts.length ? parts[pumpIndex + 1] : null;
}

/**
 * POST /api/equipment-maintenance-tracker/pumps/[id]/field-data
 * Enter field data (vibration, temperature, etc.)
 */
export async function POST(request: NextRequest) {
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
    const { techId, techName, measurements, notes } = body;

    if (!measurements) {
      return NextResponse.json({ error: 'Missing measurements' }, { status: 400 });
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

    const config = getFeaturePackConfig(request);
    const userRole = user.roles?.[0] || 'user';

    // Validate role permissions
    const roleValidation = validateRoleForFieldData(userRole, config);
    if (!roleValidation.valid) {
      return NextResponse.json(
        { error: roleValidation.error },
        { status: 403 }
      );
    }

    // Extract vibration and temperature from measurements
    const vibration = measurements.vibration ? parseFloat(measurements.vibration) : null;
    const temperature = measurements.temperature ? parseFloat(measurements.temperature) : null;

    // Update pump with field data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (vibration !== null && !isNaN(vibration)) {
      updateData.vibrationLevel = vibration;
    }
    if (temperature !== null && !isNaN(temperature)) {
      updateData.temperatureReading = temperature;
    }

    const [updatedPump] = await db
      .update(equipmentPumps)
      .set(updateData)
      .where(eq(equipmentPumps.id, id))
      .returning();

    // Log activity with field data in notes
    const fieldDataNotes = JSON.stringify({
      type: 'field_data',
      techId,
      techName,
      vibration: vibration?.toString(),
      temperature: temperature?.toString(),
      measurements,
      additionalNotes: notes,
    });

    await db.insert(equipmentActivityLog).values({
      pumpId: id,
      userId: user.sub,
      userName: user.email || user.sub,
      userRole,
      action: 'Field data entered',
      oldStatus: pump.status,
      newStatus: pump.status,
      notes: fieldDataNotes,
      timestamp: new Date(),
    });

    return NextResponse.json(updatedPump);
  } catch (error) {
    console.error('[equipment-maintenance-tracker] Enter field data error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to enter field data';
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}

