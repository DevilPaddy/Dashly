import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth } from "../../../lib/auth";
import { getCalendarClient } from "../../../lib/google";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGoogleAPIError, handleValidationError, handleGenericError } from "../../../lib/errors";
import CalendarEvent from "../../../models/CalendarEvent";

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

        if (!body.startTime) {
            return createErrorResponse(
                "Start time is required",
                "VALIDATION_ERROR",
                400,
                { field: "startTime", message: "Start time is required" }
            );
        }

        if (!body.endTime) {
            return createErrorResponse(
                "End time is required",
                "VALIDATION_ERROR",
                400,
                { field: "endTime", message: "End time is required" }
            );
        }

        const startTime = new Date(body.startTime);
        const endTime = new Date(body.endTime);

        if (startTime >= endTime) {
            return createErrorResponse(
                "End time must be after start time",
                "VALIDATION_ERROR",
                400,
                { message: "End time must be after start time" }
            );
        }

        const calendar = await getCalendarClient(user._id);
        
        // Create event in Google Calendar
        const eventData = {
            summary: body.title,
            description: body.description || undefined,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'UTC'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'UTC'
            },
            location: body.location || undefined,
            attendees: body.attendees ? body.attendees.map((email: string) => ({ email })) : undefined
        };

        const createdEvent = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventData
        });

        if (!createdEvent.data.id) {
            throw new Error("Failed to create event in Google Calendar");
        }

        // Create event in local database
        const localEventData = {
            userId: user._id,
            googleEventId: createdEvent.data.id,
            title: body.title,
            description: body.description || undefined,
            startTime,
            endTime,
            location: body.location || undefined,
            attendees: body.attendees || []
        };

        const localEvent = await CalendarEvent.create(localEventData);

        return NextResponse.json(localEvent, { status: 201 });
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.name === 'ValidationError') {
            return handleValidationError(error);
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