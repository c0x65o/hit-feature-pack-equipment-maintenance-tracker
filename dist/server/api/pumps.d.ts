import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/pumps
 * List all pumps or search pumps
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * POST /api/equipment-maintenance-tracker/pumps
 * Create a new pump
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=pumps.d.ts.map