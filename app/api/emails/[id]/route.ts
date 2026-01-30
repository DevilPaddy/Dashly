import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth, verifyOwnership } from "../../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGenericError } from "../../../lib/errors";
import Email from "../../../models/Email";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const email = await Email.findById(params.id)
            .populate('linkedTaskId', 'title status')
            .lean();

        if (!email) {
            return createErrorResponse(
                "Email not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(email.userId.toString(), user._id.toString());

        return NextResponse.json(email);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid email ID",
                "INVALID_ID",
                400
            );
        }
        
        return handleGenericError(error);
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const email = await Email.findById(params.id);

        if (!email) {
            return createErrorResponse(
                "Email not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(email.userId.toString(), user._id.toString());

        const body = await request.json();
        
        // Update allowed fields (only metadata, not email content)
        const allowedUpdates = ['isRead', 'isStarred', 'linkedTaskId'];
        const updates: any = {};

        for (const field of allowedUpdates) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        const updatedEmail = await Email.findByIdAndUpdate(
            params.id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('linkedTaskId', 'title status');

        return NextResponse.json(updatedEmail);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid email ID",
                "INVALID_ID",
                400
            );
        }
        
        return handleGenericError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const email = await Email.findById(params.id);

        if (!email) {
            return createErrorResponse(
                "Email not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(email.userId.toString(), user._id.toString());

        await Email.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid email ID",
                "INVALID_ID",
                400
            );
        }
        
        return handleGenericError(error);
    }
}