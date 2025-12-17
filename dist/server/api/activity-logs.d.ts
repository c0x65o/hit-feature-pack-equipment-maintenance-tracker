import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/activity-logs
 * Get all activity logs (admin only) or logs for a specific pump
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=activity-logs.d.ts.map