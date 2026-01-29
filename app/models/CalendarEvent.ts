import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICalendarEvent extends Document {
    userId: mongoose.Types.ObjectId;

    googleEventId: string;

    title: string;
    description?: string;

    startTime: Date;
    endTime: Date;
    timezone: string;

    linkedTaskId?: mongoose.Types.ObjectId;

    syncedAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        googleEventId: {
            type: String,
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

        startTime: {
            type: Date,
            required: true,
            index: true,
        },

        endTime: {
            type: Date,
            required: true,
            index: true,
        },

        timezone: {
            type: String,
            required: true,
        },

        linkedTaskId: {
            type: Schema.Types.ObjectId,
            ref: "Task",
        },

        syncedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// 🔐 Prevent duplicate Google events per user
CalendarEventSchema.index(
    { userId: 1, googleEventId: 1 },
    { unique: true }
);

// ⚡ Calendar views
CalendarEventSchema.index({ userId: 1, startTime: 1 });
CalendarEventSchema.index({ userId: 1, linkedTaskId: 1 });

const CalendarEvent: Model<ICalendarEvent> =
    mongoose.models.CalendarEvent ||
    mongoose.model<ICalendarEvent>("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
