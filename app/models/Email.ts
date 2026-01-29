import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmail extends Document {
    userId: mongoose.Types.ObjectId;

    gmailId: string;
    threadId: string;

    from: string;
    to: string[];

    subject?: string;
    snippet?: string;

    receivedAt: Date;

    isRead: boolean;
    labels: string[];

    linkedTaskId?: mongoose.Types.ObjectId;

    syncedAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const EmailSchema = new Schema<IEmail>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        gmailId: {
            type: String,
            required: true,
            index: true,
        },

        threadId: {
            type: String,
            index: true,
        },

        from: {
            type: String,
            required: true,
        },

        to: {
            type: [String],
            default: [],
        },

        subject: {
            type: String,
        },

        snippet: {
            type: String,
        },

        receivedAt: {
            type: Date,
            required: true,
            index: true,
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },

        labels: {
            type: [String],
            default: [],
            index: true,
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

EmailSchema.index(
    { userId: 1, gmailId: 1 },
    { unique: true }
);

const Email: Model<IEmail> =
    mongoose.models.Email ||
    mongoose.model<IEmail>("Email", EmailSchema);

export default Email;
