import mongoose, { Schema, Document, Model } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

/**
 * Task interface matching the design specification
 * Supports linking to emails, notes, and calendar events
 */
export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    tags: string[];
    linkedEmailId?: mongoose.Types.ObjectId;
    linkedNoteId?: mongoose.Types.ObjectId;
    linkedCalendarEventId?: string;  // Google Calendar Event ID (string, not ObjectId)
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Task schema with proper indexing and validation
 * Supports relationships with emails, notes, and calendar events
 */
const TaskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000
        },
        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo",
            required: true
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            required: true
        },
        dueDate: {
            type: Date,
            index: true
        },
        tags: {
            type: [String],
            default: [],
            validate: {
                validator: function(tags: string[]) {
                    return tags.every(tag => tag.length <= 50);
                },
                message: 'Tags must be 50 characters or less'
            }
        },
        linkedEmailId: {
            type: Schema.Types.ObjectId,
            ref: "Email"
        },
        linkedNoteId: {
            type: Schema.Types.ObjectId,
            ref: "Note"
        },
        linkedCalendarEventId: {
            type: String,  // Google Calendar Event ID is a string
            trim: true
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'tasks'
    }
);

// Compound indexes for efficient queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });
TaskSchema.index({ userId: 1, tags: 1 });

// Additional indexes for performance
TaskSchema.index({ userId: 1 });
TaskSchema.index({ linkedEmailId: 1 });
TaskSchema.index({ linkedNoteId: 1 });
TaskSchema.index({ linkedCalendarEventId: 1 });

/**
 * Task model with proper typing
 */
const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
