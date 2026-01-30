import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { encrypt, decrypt } from "./crypto";
import OAuthToken from "../models/OAuthToken";

/**
 * Initialize Google OAuth2 client
 * @returns OAuth2Client
 */
function createOAuth2Client(): OAuth2Client {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NEXTAUTH_URL + "/api/auth/callback/google"
    );
}

/**
 * Get authenticated Gmail client for user
 * @param userId - User's ObjectId
 * @returns Promise<gmail_v1.Gmail>
 */
export async function getGmailClient(userId: mongoose.Types.ObjectId) {
    const oauth2Client = await getAuthenticatedClient(userId);
    return google.gmail({ version: "v1", auth: oauth2Client });
}

/**
 * Get authenticated Calendar client for user
 * @param userId - User's ObjectId
 * @returns Promise<calendar_v3.Calendar>
 */
export async function getCalendarClient(userId: mongoose.Types.ObjectId) {
    const oauth2Client = await getAuthenticatedClient(userId);
    return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * Get authenticated OAuth2 client for user
 * @param userId - User's ObjectId
 * @returns Promise<OAuth2Client>
 */
async function getAuthenticatedClient(userId: mongoose.Types.ObjectId): Promise<OAuth2Client> {
    await connectDB();
    
    const tokenRecord = await OAuthToken.findOne({ userId, provider: "google" });
    if (!tokenRecord) {
        throw new Error("No OAuth tokens found for user");
    }

    // Check if token needs refresh
    if (new Date() >= tokenRecord.expiresAt) {
        await refreshTokenIfNeeded(userId);
        // Refetch the updated token
        const updatedTokenRecord = await OAuthToken.findOne({ userId, provider: "google" });
        if (!updatedTokenRecord) {
            throw new Error("Failed to refresh token");
        }
        return createClientWithTokens(updatedTokenRecord);
    }

    return createClientWithTokens(tokenRecord);
}

/**
 * Create OAuth2 client with decrypted tokens
 * @param tokenRecord - OAuthToken document
 * @returns OAuth2Client
 */
function createClientWithTokens(tokenRecord: any): OAuth2Client {
    const oauth2Client = createOAuth2Client();
    
    try {
        const accessToken = decrypt(tokenRecord.accessToken);
        const refreshToken = decrypt(tokenRecord.refreshToken);
        
        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
            expiry_date: tokenRecord.expiresAt.getTime(),
            scope: tokenRecord.scopes.join(" ")
        });
        
        return oauth2Client;
    } catch (error) {
        throw new Error("Failed to decrypt OAuth tokens");
    }
}

/**
 * Refresh access token if needed
 * @param userId - User's ObjectId
 * @returns Promise<boolean> - True if token was refreshed
 */
export async function refreshTokenIfNeeded(userId: mongoose.Types.ObjectId): Promise<boolean> {
    await connectDB();
    
    const tokenRecord = await OAuthToken.findOne({ userId, provider: "google" });
    if (!tokenRecord) {
        throw new Error("No OAuth tokens found for user");
    }

    // Check if token is expired or will expire in the next 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    if (tokenRecord.expiresAt > fiveMinutesFromNow) {
        return false; // Token is still valid
    }

    try {
        const oauth2Client = createOAuth2Client();
        const refreshToken = decrypt(tokenRecord.refreshToken);
        
        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        
        if (!credentials.access_token || !credentials.expiry_date) {
            throw new Error("Invalid refresh response");
        }

        // Update token record with new access token
        await OAuthToken.findByIdAndUpdate(tokenRecord._id, {
            accessToken: encrypt(credentials.access_token),
            expiresAt: new Date(credentials.expiry_date),
            updatedAt: new Date()
        });

        console.log("🔄 OAuth token refreshed for user:", userId);
        return true;
    } catch (error) {
        console.error("Failed to refresh OAuth token:", error);
        throw new Error("Token refresh failed");
    }
}