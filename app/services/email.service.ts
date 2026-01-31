// src/services/email.service.ts
import Email from "../models/Email";
import { connectDB } from "../lib/db";

type GmailEmail = {
  gmailId: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  unread: boolean;
};

export async function syncEmails(
  userId: string,
  emails: GmailEmail[]
) {
  await connectDB();

  let inserted = 0;
  let updated = 0;

  for (const email of emails) {
    const res = await Email.updateOne(
      { userId, gmailId: email.gmailId },
      {
        $set: {
          ...email,
          userId,
          syncedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (res.upsertedCount) inserted++;
    else if (res.modifiedCount) updated++;
  }

  return { inserted, updated };
}
