import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth } from "../../../lib/auth";
import { getGmailClient } from "../../../lib/google";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGoogleAPIError, handleGenericError } from "../../../lib/errors";
import Email from "../../../models/Email";

export async function PATCH(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const body = await request.json();
        
        if (!body.gmailId || typeof body.isRead !== 'boolean') {
            return createErrorResponse(
                "gmailId and isRead are required",
                "VALIDATION_ERROR",
                400,
                { message: "gmailId (string) and isRead (boolean) are required fields" }
            );
        }

        const gmail = await getGmailClient(user._id);
        
        // Update Gmail via API
        const labelModifications = {
            addLabelIds: body.isRead ? [] : ['UNREAD'],
            removeLabelIds: body.isRead ? ['UNREAD'] : []
        };

        await gmail.users.messages.modify({
            userId: 'me',
            id: body.gmailId,
            requestBody: labelModifications
        });

        // Update local database
        const updatedEmail = await Email.findOneAndUpdate(
            {
                userId: user._id,
                gmailId: body.gmailId
            },
            {
                isRead: body.isRead,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedEmail) {
            return createErrorResponse(
                "Email not found in local database",
                "NOT_FOUND",
                404
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.message?.includes('Google') || error.code) {
            return handleGoogleAPIError(error);
        }
        
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return handleDatabaseError(error);
        }
        
        return handleGenericError(error);
    }
}