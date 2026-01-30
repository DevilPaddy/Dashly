import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth } from "../../../lib/auth";
import { getCalendarClient } from "../../../lib/google";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGoogleAPIError, handleGenericError } from "../../../lib/errors";
import CalendarEvent from "../../../models/CalendarEvent";

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const body = await request.json();
        
        // Default to next 30 days if no date range provided
        const startDate = body.startDate ? new Date(body.startDate) : new Date();
        const endDate = body.endDate ? new Date(body.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const calendar = await getCalendarClient(user._id);
        
        // Fetch events from Google Calendar
        const eventsResponse = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            maxResults: 250,
            singleEvents: true,
            orderBy: 'startTime'
        });

        const events = eventsResponse.data.items || [];
        let synced = 0;
        let errors = 0;

        // Process each event
        for (const event of events) {
            try {
                if (!event.id) continue;

                // Check if we already have this event
                const existingEvent = await CalendarEvent.findOne({
                    userId: user._id,
                    googleEventId: event.id
                });

                const startTime = event.start?.dateTime ? new Date(event.start.dateTime) : 
                                 event.start?.date ? new Date(event.start.date) : new Date();
                
                const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : 
                               event.end?.date ? new Date(event.end.date) : new Date();

                const attendees = event.attendees?.map(a => a.email || '') || [];

                const eventData = {
                    userId: user._id,
                    googleEventId: event.id,
                    title: event.summary || 'Untitled Event',
                    description: event.description || undefined,
                    startTime,
                    endTime,
                    location: event.location || undefined,
                    attendees
                };

                if (existingEvent) {
                    // Update existing event
                    await CalendarEvent.findByIdAndUpdate(existingEvent._id, {
                        ...eventData,
                        updatedAt: new Date()
                    });
                } else {
                    // Create new event
                    await CalendarEvent.create(eventData);
                }
                
                synced++;
            } catch (error) {
                console.error(`Error processing event ${event.id}:`, error);
                errors++;
            }
        }

        const syncResult = {
            synced,
            errors,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(syncResult);
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