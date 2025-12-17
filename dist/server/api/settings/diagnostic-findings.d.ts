import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * GET /api/equipment-maintenance-tracker/settings/diagnostic-findings
 * List all diagnostic findings
 */
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
/**
 * POST /api/equipment-maintenance-tracker/settings/diagnostic-findings
 * Create diagnostic finding (admin only)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
/**
 * PUT /api/equipment-maintenance-tracker/settings/diagnostic-findings/[id]
 * Update diagnostic finding (admin only)
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
/**
 * DELETE /api/equipment-maintenance-tracker/settings/diagnostic-findings/[id]
 * Delete diagnostic finding (admin only)
 */
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=diagnostic-findings.d.ts.map