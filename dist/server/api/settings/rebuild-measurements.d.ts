import { NextRequest, NextResponse } from 'next/server';
export declare const dynamic = "force-dynamic";
export declare const runtime = "nodejs";
export declare function GET(request: NextRequest): Promise<NextResponse<any>>;
export declare function POST(request: NextRequest): Promise<NextResponse<any>>;
export declare function PUT(request: NextRequest): Promise<NextResponse<any>>;
export declare function DELETE(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
//# sourceMappingURL=rebuild-measurements.d.ts.map