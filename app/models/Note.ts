import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
    userId: mongoose.Types.ObjectId;

    title: string;
    content: string;

    linkedTaskId?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
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

        content: {
            type: String,
            required: true,
        },

        linkedTaskId: {
            type: Schema.Types.ObjectId,
            ref: "Task",
        },
    },
    {
        timestamps: true,
    }
);

// ⚡ Common queries
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ userId: 1, linkedTaskId: 1 });

const Note: Model<INote> =
    mongoose.models.Note ||
    mongoose.model<INote>("Note", NoteSchema);

export default Note;
