import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import { requireAuth } from "../../../lib/auth";
import { getGmailClient } from "../../../lib/google";
import { createErrorResponse, handleAuthError, handleDatabaseError, handleGoogleAPIError, handleGenericError } from "../../../lib/errors";
import Email from "../../../models/Email";

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        await connectDB();

        const body = await request.json();
        const maxResults = Math.min(body.maxResults || 100, 100); // Cap at 100

        const gmail = await getGmailClient(user._id);
        
        // Fetch messages from Gmail
        const messagesResponse = await gmail.users.messages.list({
            userId: 'me',
            maxResults,
            q: 'in:inbox'
        });

        const messages = messagesResponse.data.messages || [];
        let synced = 0;
        let errors = 0;

        // Process each message
        for (const message of messages) {
            try {
                if (!message.id) continue;

                // Check if we already have this email
                const existingEmail = await Email.findOne({
                    userId: user._id,
                    gmailId: message.id
                });

                if (existingEmail) {
                    continue; // Skip if already synced
                }

                // Fetch full message details
                const messageDetails = await gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                    format: 'metadata',
                    metadataHeaders: ['From', 'To', 'Subject', 'Date']
                });

                const messageData = messageDetails.data;
                const headers = messageData.payload?.headers || [];

                // Extract metadata
                const from = headers.find(h => h.name === 'From')?.value || '';
                const to = headers.find(h => h.name === 'To')?.value?.split(',') || [];
                const subject = headers.find(h => h.name === 'Subject')?.value || '';
                const dateHeader = headers.find(h => h.name === 'Date')?.value;
                
                const receivedAt = dateHeader ? new Date(dateHeader) : new Date();
                const isRead = !messageData.labelIds?.includes('UNREAD');
                const isStarred = messageData.labelIds?.includes('STARRED') || false;
                const labels = messageData.labelIds || [];

                // Create email record
                const emailData = {
                    userId: user._id,
                    gmailId: message.id,
                    threadId: messageData.threadId || '',
                    from,
                    to,
                    subject,
                    snippet: messageData.snippet || '',
                    isRead,
                    isStarred,
                    labels,
                    receivedAt
                };

                await Email.create(emailData);
                synced++;
            } catch (error) {
                console.error(`Error processing message ${message.id}:`, error);
                errors++;
            }
        }

        const syncResult = {
            synced,
            errors,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(syncResult);
    } catch (error: any) {
        if (error.message === "Authentication required" || error.message === "Access denied") {
            return handleAuthError(error);
        }
        
        if (error.message?.includes('Google') || error.code) {
            return handleGoogleAPIError(error);
        }
        
        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return handleDatabaseError(error);
        }
        
        return handleGenericError(error);
    }
}