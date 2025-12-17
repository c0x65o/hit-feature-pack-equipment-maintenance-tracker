import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
/**
 * POST /api/equipment-maintenance-tracker/pumps/[id]/field-data
 * Enter field data (vibration, temperature, etc.)
 */
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
//# sourceMappingURL=pumps-field-data.d.ts.map