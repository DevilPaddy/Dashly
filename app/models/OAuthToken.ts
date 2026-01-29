import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOAuthToken extends Document {
    userId: mongoose.Types.ObjectId;

    provider: "google";

    accessToken: string;        // encrypted
    refreshToken?: string;      // encrypted

    scopes: string[];

    expiresAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const OAuthTokenSchema = new Schema<IOAuthToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        provider: {
            type: String,
            required: true,
            enum: ["google"],
            index: true,
        },

        accessToken: {
            type: String,
            required: true,
        },

        refreshToken: {
            type: String,
        },

        scopes: {
            type: [String],
            default: [],
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

OAuthTokenSchema.index(
    { userId: 1, provider: 1 },
    { unique: true }
);

const OAuthToken: Model<IOAuthToken> =
    mongoose.models.OAuthToken ||
    mongoose.model<IOAuthToken>("OAuthToken", OAuthTokenSchema);

export default OAuthToken;
