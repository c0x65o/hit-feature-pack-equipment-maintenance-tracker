import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/pumps/[id]
 * Get pump with full hierarchy (equipment, location, plant)
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    pump: any;
    equipment: any;
    location: any;
    plant: any;
}>>;
/**
 * PATCH /api/equipment-maintenance-tracker/pumps/[id]
 * Update pump (admin only)
 */
export declare function PATCH(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/equipment-maintenance-tracker/pumps/[id]
 * Delete pump (admin only)
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=pumps-id.d.ts.map