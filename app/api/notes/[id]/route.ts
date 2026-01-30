import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth, verifyOwnership } from "../../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleValidationError, handleGenericError } from "../../../lib/errors";
import Note from "../../../models/Note";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const note = await Note.findById(params.id)
            .populate('linkedTaskIds', 'title status')
            .lean();

        if (!note) {
            return createErrorResponse(
                "Note not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(note.userId.toString(), user._id.toString());

        return NextResponse.json(note);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid note ID",
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

        const note = await Note.findById(params.id);

        if (!note) {
            return createErrorResponse(
                "Note not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(note.userId.toString(), user._id.toString());

        const body = await request.json();
        
        // Update allowed fields
        const allowedUpdates = ['title', 'content', 'tags', 'linkedTaskIds'];
        const updates: any = {};

        for (const field of allowedUpdates) {
            if (body[field] !== undefined) {
                if (field === 'title' && body[field]) {
                    updates[field] = body[field].trim();
                } else if (field === 'content' && body[field]) {
                    updates[field] = body[field].trim();
                } else {
                    updates[field] = body[field];
                }
            }
        }

        const updatedNote = await Note.findByIdAndUpdate(
            params.id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('linkedTaskIds', 'title status');

        return NextResponse.json(updatedNote);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'ValidationError') {
            return handleValidationError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid note ID",
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

        const note = await Note.findById(params.id);

        if (!note) {
            return createErrorResponse(
                "Note not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(note.userId.toString(), user._id.toString());

        await Note.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid note ID",
                "INVALID_ID",
                400
            );
        }
        
        return handleGenericError(error);
    }
}