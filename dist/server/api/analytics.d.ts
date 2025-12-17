import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/analytics/plant
 * Get plant-wide analytics
 */
export declare function GET(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<import("../lib/analytics").PlantAnalytics>>;
//# sourceMappingURL=analytics.d.ts.map