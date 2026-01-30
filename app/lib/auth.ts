import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectDB } from "./db";
import User, { IUser } from "../models/User";

/**
 * Get current user from session
 * @param req - NextRequest object
 * @returns Promise<IUser | null> - User object or null if not authenticated
 */
export async function getCurrentUser(req: NextRequest): Promise<IUser | null> {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        if (!token?.email) {
            return null;
        }

        await connectDB();
        const user = await User.findOne({ email: token.email });
        return user;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
}

/**
 * Require authentication and return user
 * @param req - NextRequest object
 * @returns Promise<IUser> - User object
 * @throws Error if not authenticated
 */
export async function requireAuth(req: NextRequest): Promise<IUser> {
    const user = await getCurrentUser(req);
    
    if (!user) {
        throw new Error("Authentication required");
    }
    
    return user;
}

/**
 * Verify user owns a resource
 * @param userId - User ID from resource
 * @param authenticatedUserId - Authenticated user's ID
 * @throws Error if user doesn't own the resource
 */
export function verifyOwnership(userId: string, authenticatedUserId: string): void {
    if (userId !== authenticatedUserId.toString()) {
        throw new Error("Access denied");
    }
}