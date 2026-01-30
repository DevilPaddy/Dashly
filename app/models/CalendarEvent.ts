import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Calendar Event interface matching the design specification
 * Stores Google Calendar event data with task linking support
 */
export interface ICalendarEvent extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    googleEventId: string;        // Google Calendar Event ID
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
    attendees: string[];
    linkedTaskId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Calendar Event schema with proper indexing for Google Calendar integration
 * Supports efficient date range queries and unique constraints
 */
const CalendarEventSchema = new Schema<ICalendarEvent>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        googleEventId: {
            type: String,
            required: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            trim: true
        },
        startTime: {
            type: Date,
            required: true,
            index: true
        },
        endTime: {
            type: Date,
            required: true,
            index: true
        },
        location: {
            type: String,
            trim: true
        },
        attendees: {
            type: [String],
            required: true,
            default: []
        },
        linkedTaskId: {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'calendarevents'
    }
);

// Unique constraint: one event per user per googleEventId
CalendarEventSchema.index({ userId: 1, googleEventId: 1 }, { unique: true });

// Compound indexes for efficient calendar queries
CalendarEventSchema.index({ userId: 1, startTime: 1 });
CalendarEventSchema.index({ userId: 1, endTime: 1 });
CalendarEventSchema.index({ userId: 1, startTime: 1, endTime: 1 });

// Additional indexes for performance
CalendarEventSchema.index({ userId: 1 });
CalendarEventSchema.index({ googleEventId: 1 });
CalendarEventSchema.index({ linkedTaskId: 1 });

/**
 * Calendar Event model with proper typing
 */
const CalendarEvent: Model<ICalendarEvent> = 
    mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
