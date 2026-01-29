import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
}


declare global {

    var _mongoose:
        | {
            conn: mongoose.Mongoose | null;
            promise: Promise<mongoose.Mongoose> | null;
        }
        | undefined;
}

const cached =
    (global._mongoose ??= {
        conn: null,
        promise: null,
    });


export async function connectDB(): Promise<mongoose.Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🟡 MongoDB: connecting...");
        cached.promise = mongoose.connect(MONGODB_URI!);
    }

    cached.conn = await cached.promise;

    console.log("🟢 MongoDB: connected");
    return cached.conn;
}
