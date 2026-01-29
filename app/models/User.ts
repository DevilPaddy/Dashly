import mongoose, { Schema, Document, Model } from "mongoose";



export interface IUser extends Document {
    name?: string;
    email?: string;
    image?: string;

    provider: "google";
    providerAccountId: string;

    oauth: {
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpiry?: Date;
        scopes: string[];
    };

    preferences: {
        theme: "dark" | "light" | "system";
        locale: string;
        timezone?: string;
    };

    ai: {
        enabled: boolean;
        localOnly: boolean;
        model: string;
    };

    sync: {
        lastGmailSyncAt?: Date;
        lastCalendarSyncAt?: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}



const UserSchema = new Schema<IUser>(
    {
        name: String,
        email: { type: String, unique: true, sparse: true },
        image: String,

        provider: {
            type: String,
            required: true,
            enum: ["google"],
        },

        providerAccountId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        oauth: {
            accessToken: { type: String },
            refreshToken: { type: String },
            accessTokenExpiry: { type: Date },
            scopes: {
                type: [String],
                default: [],
            },
        },

        preferences: {
            theme: {
                type: String,
                enum: ["dark", "light", "system"],
                default: "dark",
            },
            locale: {
                type: String,
                default: "en",
            },
            timezone: String,
        },

        ai: {
            enabled: {
                type: Boolean,
                default: true,
            },
            localOnly: {
                type: Boolean,
                default: true,
            },
            model: {
                type: String,
                default: "llama-7b-4bit",
            },
        },

        sync: {
            lastGmailSyncAt: Date,
            lastCalendarSyncAt: Date,
        },
    },
    {
        timestamps: true,
    }
);


UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1, providerAccountId: 1 });


const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
