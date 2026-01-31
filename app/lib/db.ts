import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env");
}

// Connection configuration with pooling and error handling
const connectionOptions: mongoose.ConnectOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
};

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

/**
 * Connect to MongoDB with connection pooling and error handling
 * Implements retry logic and graceful error handling
 * @returns Promise<mongoose.Mongoose> - The mongoose connection
 */
export async function connectDB(): Promise<mongoose.Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🟡 MongoDB: connecting...");
        
        cached.promise = mongoose.connect(MONGODB_URI!, connectionOptions)
            .then((mongoose) => {
                console.log("🟢 MongoDB: connected successfully");
                
                // Set up connection event listeners
                mongoose.connection.on('error', (error) => {
                    console.error("🔴 MongoDB: connection error", error);
                });
                
                mongoose.connection.on('disconnected', () => {
                    console.log("🟡 MongoDB: disconnected");
                });
                
                mongoose.connection.on('reconnected', () => {
                    console.log("🟢 MongoDB: reconnected");
                });
                
                return mongoose;
            })
            .catch((error) => {
                console.error("🔴 MongoDB: connection failed", error);
                cached.promise = null; // Reset promise to allow retry
                throw new Error(`Database connection failed: ${error.message}`);
            });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null; // Reset promise to allow retry
        throw error;
    }
}

/**
 * Check if MongoDB is connected
 * @returns boolean - Connection status
 */
export function isConnected(): boolean {
    return cached.conn?.connection?.readyState === 1;
}

/**
 * Disconnect from MongoDB gracefully
 */
export async function disconnectDB(): Promise<void> {
    if (cached.conn) {
        await cached.conn.disconnect();
        cached.conn = null;
        cached.promise = null;
        console.log("🟡 MongoDB: disconnected");
    }
}

/**
 * Get connection status for health checks
 * @returns string - Connection status
 */
export function getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!cached.conn) return 'disconnected';
    
    const readyState = cached.conn.connection.readyState;
    switch (readyState) {
        case 1: return 'connected';
        case 2: return 'connecting';
        default: return 'disconnected';
    }
}

/**
 * Retry database operation with exponential backoff
 * @param operation - The database operation to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise<T> - Result of the operation
 */
export async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            
            if (attempt === maxRetries) {
                throw lastError;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`🟡 Database operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
}

/**
 * Execute database operation with automatic connection and error handling
 * @param operation - The database operation to execute
 * @returns Promise<T> - Result of the operation
 */
export async function withDB<T>(operation: () => Promise<T>): Promise<T> {
    await connectDB();
    return retryOperation(operation);
}