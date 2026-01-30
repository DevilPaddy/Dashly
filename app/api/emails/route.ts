import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { requireAuth } from "../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGenericError } from "../../lib/errors";
import Email from "../../models/Email";

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const { searchParams } = new URL(request.url);
        const isRead = searchParams.get('isRead');
        const isStarred = searchParams.get('isStarred');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build filter query
        const filter: any = { userId: user._id };
        
        if (isRead !== null) {
            filter.isRead = isRead === 'true';
        }
        
        if (isStarred !== null) {
            filter.isStarred = isStarred === 'true';
        }

        const emails = await Email.find(filter)
            .sort({ receivedAt: -1 })
            .limit(Math.min(limit, 100)) // Cap at 100 emails
            .populate('linkedTaskId', 'title status')
            .lean();

        return NextResponse.json(emails);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return handleDatabaseError(error);
        }
        
        return handleGenericError(error);
    }
}