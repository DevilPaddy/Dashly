import { NextResponse } from "next/server";
import { getConnectionStatus } from "../../lib/db";

export async function GET() {
    try {
        const dbStatus = getConnectionStatus();
        const timestamp = new Date().toISOString();
        
        const healthResponse = {
            status: dbStatus === 'connected' ? 'ok' : 'degraded',
            timestamp,
            mongodb: dbStatus
        };

        const statusCode = dbStatus === 'connected' ? 200 : 503;
        
        return NextResponse.json(healthResponse, { status: statusCode });
    } catch (error) {
        console.error("Health check failed:", error);
        
        return NextResponse.json({
            status: 'error',
            timestamp: new Date().toISOString(),
            mongodb: 'disconnected'
        }, { status: 503 });
    }
}