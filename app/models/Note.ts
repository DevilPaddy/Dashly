import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Note interface matching the design specification
 * Supports bidirectional relationships with tasks and rich text content
 */
export interface INote extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    content: string;              // Rich text / Markdown
    tags: string[];
    linkedTaskIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Note schema with proper indexing and validation
 * Supports bidirectional task relationships and rich content
 */
const NoteSchema = new Schema<INote>(
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
        content: {
            type: String,
            required: true,
            // Supports rich text/Markdown content
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
        linkedTaskIds: {
            type: [Schema.Types.ObjectId],
            ref: "Task",
            default: []
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'notes'
    }
);

// Compound indexes for efficient queries
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, tags: 1 });
NoteSchema.index({ userId: 1, linkedTaskIds: 1 });

// Additional indexes for performance
NoteSchema.index({ userId: 1 });
NoteSchema.index({ linkedTaskIds: 1 });

/**
 * Note model with proper typing
 */
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
