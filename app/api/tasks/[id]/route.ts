import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth, verifyOwnership } from "../../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleValidationError, handleGenericError } from "../../../lib/errors";
import Task from "../../../models/Task";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const task = await Task.findById(params.id)
            .populate('linkedEmailId', 'subject from')
            .populate('linkedNoteId', 'title')
            .lean();

        if (!task) {
            return createErrorResponse(
                "Task not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(task.userId.toString(), user._id.toString());

        return NextResponse.json(task);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid task ID",
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

        const task = await Task.findById(params.id);

        if (!task) {
            return createErrorResponse(
                "Task not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(task.userId.toString(), user._id.toString());

        const body = await request.json();
        
        // Validate status if provided
        if (body.status && !['todo', 'in_progress', 'done'].includes(body.status)) {
            return createErrorResponse(
                "Invalid status",
                "VALIDATION_ERROR",
                400,
                { field: "status", message: "Status must be one of: todo, in_progress, done" }
            );
        }

        // Validate priority if provided
        if (body.priority && !['low', 'medium', 'high'].includes(body.priority)) {
            return createErrorResponse(
                "Invalid priority",
                "VALIDATION_ERROR",
                400,
                { field: "priority", message: "Priority must be one of: low, medium, high" }
            );
        }

        // Update allowed fields
        const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'tags', 'linkedEmailId', 'linkedNoteId', 'linkedCalendarEventId'];
        const updates: any = {};

        for (const field of allowedUpdates) {
            if (body[field] !== undefined) {
                if (field === 'title' && body[field]) {
                    updates[field] = body[field].trim();
                } else if (field === 'description' && body[field]) {
                    updates[field] = body[field].trim();
                } else if (field === 'dueDate' && body[field]) {
                    updates[field] = new Date(body[field]);
                } else {
                    updates[field] = body[field];
                }
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            params.id,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('linkedEmailId', 'subject from')
         .populate('linkedNoteId', 'title');

        return NextResponse.json(updatedTask);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'ValidationError') {
            return handleValidationError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid task ID",
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

        const task = await Task.findById(params.id);

        if (!task) {
            return createErrorResponse(
                "Task not found",
                "NOT_FOUND",
                404
            );
        }

        verifyOwnership(task.userId.toString(), user._id.toString());

        await Task.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'CastError') {
            return createErrorResponse(
                "Invalid task ID",
                "INVALID_ID",
                400
            );
        }
        
        return handleGenericError(error);
    }
}