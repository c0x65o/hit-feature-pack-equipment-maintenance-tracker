import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/plants
 * List all plants
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * POST /api/equipment-maintenance-tracker/plants
 * Create a new plant (admin only)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PATCH /api/equipment-maintenance-tracker/plants/[id]
 * Update plant (admin only)
 */
export declare function PATCH(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=plants.d.ts.map