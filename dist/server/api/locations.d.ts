import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/locations
 * List all locations
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * POST /api/equipment-maintenance-tracker/locations
 * Create a new location (admin only)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PATCH /api/equipment-maintenance-tracker/locations/[id]
 * Update location (admin only)
 */
export declare function PATCH(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/equipment-maintenance-tracker/locations/[id]
 * Delete location (admin only)
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=locations.d.ts.map