import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/pumps/[id]/analytics
 * Get pump analytics
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("../lib/analytics").PumpAnalytics>>;
//# sourceMappingURL=pumps-analytics.d.ts.map