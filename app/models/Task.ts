import mongoose, { Schema, Document, Model } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface ITask extends Document {
    userId: mongoose.Types.ObjectId;

    title: string;
    description?: string;

    status: TaskStatus;
    priority: TaskPriority;

    dueDate?: Date;
    completedAt?: Date;

    linkedEmailId?: mongoose.Types.ObjectId;
    linkedNoteId?: mongoose.Types.ObjectId;
    linkedCalendarEventId?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
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

        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo",
            index: true,
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            index: true,
        },

        dueDate: {
            type: Date,
            index: true,
        },

        completedAt: {
            type: Date,
        },

        linkedEmailId: {
            type: Schema.Types.ObjectId,
            ref: "Email",
        },

        linkedNoteId: {
            type: Schema.Types.ObjectId,
            ref: "Note",
        },

        linkedCalendarEventId: {
            type: Schema.Types.ObjectId,
            ref: "CalendarEvent",
        },
    },
    {
        timestamps: true,
    }
);

// ⚡ Common dashboard queries
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

const Task: Model<ITask> =
    mongoose.models.Task ||
    mongoose.model<ITask>("Task", TaskSchema);

export default Task;
