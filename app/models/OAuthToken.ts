import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * OAuth Token interface matching the design specification
 * All tokens are encrypted using AES-256-GCM before storage
 */
export interface IOAuthToken extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    provider: 'google';
    accessToken: string;        // AES-256-GCM encrypted
    refreshToken: string;       // AES-256-GCM encrypted
    expiresAt: Date;
    scopes: string[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * OAuth Token schema with proper indexing and validation
 * Supports encrypted token storage for security
 */
const OAuthTokenSchema = new Schema<IOAuthToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        provider: {
            type: String,
            required: true,
            enum: ['google'],
            default: 'google'
        },
        accessToken: {
            type: String,
            required: true,
            // Note: This field stores encrypted token data
        },
        refreshToken: {
            type: String,
            required: true,
            // Note: This field stores encrypted token data
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true
        },
        scopes: {
            type: [String],
            required: true,
            default: []
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        collection: 'oauthtokens'
    }
);

// Compound unique index to ensure one token per user per provider
OAuthTokenSchema.index({ userId: 1, provider: 1 }, { unique: true });

// Additional indexes for performance
OAuthTokenSchema.index({ userId: 1 });
OAuthTokenSchema.index({ expiresAt: 1 }); // For token expiry queries

/**
 * OAuth Token model with proper typing
 */
const OAuthToken: Model<IOAuthToken> = 
    mongoose.models.OAuthToken || mongoose.model<IOAuthToken>("OAuthToken", OAuthTokenSchema);

export default OAuthToken;
