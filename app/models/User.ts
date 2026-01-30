import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * User interface matching the design specification
 * OAuth tokens are stored separately in OAuthToken model for security
 */
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
    picture?: string;
    googleId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User schema with proper indexing for performance and security
 */
const UserSchema = new Schema<IUser>(
    {
        email: { 
            type: String, 
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },
        name: { 
            type: String,
            trim: true
        },
        picture: { 
            type: String,
            trim: true
        },
        googleId: { 
            type: String, 
            required: true,
            unique: true,
            index: true
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'users'
    }
);

// Compound index for efficient queries
UserSchema.index({ googleId: 1, email: 1 });

// Ensure indexes are created
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ googleId: 1 }, { unique: true });

/**
 * User model with proper typing
 */
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
