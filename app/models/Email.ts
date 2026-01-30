import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Email interface matching the design specification
 * Stores Gmail metadata with optional full body content
 */
export interface IEmail extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    gmailId: string;              // Gmail message ID
    threadId: string;
    from: string;
    to: string[];
    subject: string;
    snippet: string;
    body?: string;                // Full body (optional)
    isRead: boolean;
    isStarred: boolean;
    labels: string[];
    receivedAt: Date;
    linkedTaskId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Email schema with proper indexing for Gmail integration
 * Supports efficient queries and unique constraints
 */
const EmailSchema = new Schema<IEmail>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        gmailId: {
            type: String,
            required: true,
            trim: true
        },
        threadId: {
            type: String,
            required: true,
            trim: true
        },
        from: {
            type: String,
            required: true,
            trim: true
        },
        to: {
            type: [String],
            required: true,
            default: []
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            default: ""
        },
        snippet: {
            type: String,
            required: true,
            trim: true,
            default: ""
        },
        body: {
            type: String,
            // Optional full body content
        },
        isRead: {
            type: Boolean,
            required: true,
            default: false
        },
        isStarred: {
            type: Boolean,
            required: true,
            default: false
        },
        labels: {
            type: [String],
            required: true,
            default: []
        },
        receivedAt: {
            type: Date,
            required: true,
            index: true
        },
        linkedTaskId: {
            type: Schema.Types.ObjectId,
            ref: "Task"
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'emails'
    }
);

// Unique constraint: one email per user per gmailId
EmailSchema.index({ userId: 1, gmailId: 1 }, { unique: true });

// Compound indexes for efficient queries
EmailSchema.index({ userId: 1, isRead: 1 });
EmailSchema.index({ userId: 1, receivedAt: -1 });
EmailSchema.index({ userId: 1, isStarred: 1 });
EmailSchema.index({ userId: 1, labels: 1 });

// Additional indexes for performance
EmailSchema.index({ userId: 1 });
EmailSchema.index({ gmailId: 1 });
EmailSchema.index({ threadId: 1 });
EmailSchema.index({ linkedTaskId: 1 });

/**
 * Email model with proper typing
 */
const Email: Model<IEmail> = mongoose.models.Email || mongoose.model<IEmail>("Email", EmailSchema);

export default Email;
