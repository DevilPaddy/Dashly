import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import { requireAuth } from "../../lib/auth";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleValidationError, handleGenericError } from "../../lib/errors";
import Task, { ITask, TaskStatus, TaskPriority } from "../../models/Task";

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as TaskStatus | null;
        const priority = searchParams.get('priority') as TaskPriority | null;
        const tag = searchParams.get('tag');

        // Build filter query
        const filter: any = { userId: user._id };
        
        if (status) {
            filter.status = status;
        }
        
        if (priority) {
            filter.priority = priority;
        }
        
        if (tag) {
            filter.tags = { $in: [tag] };
        }

        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .populate('linkedEmailId', 'subject from')
            .populate('linkedNoteId', 'title')
            .lean();

        return NextResponse.json(tasks);
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

        const taskData = {
            userId: user._id,
            title: body.title.trim(),
            description: body.description?.trim(),
            status: body.status || 'todo',
            priority: body.priority || 'medium',
            dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
            tags: Array.isArray(body.tags) ? body.tags : [],
            linkedEmailId: body.linkedEmailId,
            linkedNoteId: body.linkedNoteId,
            linkedCalendarEventId: body.linkedCalendarEventId
        };

        const task = new Task(taskData);
        await task.save();

        return NextResponse.json(task, { status: 201 });
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