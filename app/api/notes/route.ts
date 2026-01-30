import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { requireAuth } from "../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleValidationError, handleGenericError } from "../../lib/errors";
import Note, { INote } from "../../models/Note";

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const { searchParams } = new URL(request.url);
        const tag = searchParams.get('tag');

        // Build filter query
        const filter: any = { userId: user._id };
        
        if (tag) {
            filter.tags = { $in: [tag] };
        }

        const notes = await Note.find(filter)
            .sort({ createdAt: -1 })
            .populate('linkedTaskIds', 'title status')
            .lean();

        return NextResponse.json(notes);
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

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const body = await request.json();
        
        // Validate required fields
        if (!body.title || typeof body.title !== 'string') {
            return createErrorResponse(
                "Title is required",
                "VALIDATION_ERROR",
                400,
                { field: "title", message: "Title must be a non-empty string" }
            );
        }

        if (!body.content || typeof body.content !== 'string') {
            return createErrorResponse(
                "Content is required",
                "VALIDATION_ERROR",
                400,
                { field: "content", message: "Content must be a non-empty string" }
            );
        }

        const noteData = {
            userId: user._id,
            title: body.title.trim(),
            content: body.content.trim(),
            tags: Array.isArray(body.tags) ? body.tags : [],
            linkedTaskIds: Array.isArray(body.linkedTaskIds) ? body.linkedTaskIds : []
        };

        const note = new Note(noteData);
        await note.save();

        return NextResponse.json(note, { status: 201 });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'ValidationError') {
            return handleValidationError(error);
        }
        
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return handleDatabaseError(error);
        }
        
        return handleGenericError(error);
    }
}