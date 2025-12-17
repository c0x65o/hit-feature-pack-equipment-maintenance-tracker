import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/equipment
 * List all equipment
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * POST /api/equipment-maintenance-tracker/equipment
 * Create new equipment (admin only)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PATCH /api/equipment-maintenance-tracker/equipment/[id]
 * Update equipment (admin only)
 */
export declare function PATCH(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/equipment-maintenance-tracker/equipment/[id]
 * Delete equipment (admin only)
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=equipment.d.ts.map