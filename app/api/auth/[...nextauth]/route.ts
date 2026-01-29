import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
].join(" ");

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async signIn({ user, account }) {
      if (!account || account.provider !== "google") return false;

      await connectDB();

      await User.findOneAndUpdate(
        {
          provider: "google",
          providerAccountId: account.providerAccountId,
        },
        {
          name: user.name,
          email: user.email,
          image: user.image,

          provider: "google",
          providerAccountId: account.providerAccountId,

          oauth: {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpiry: new Date(account.expires_at! * 1000),
            scopes: account.scope?.split(" ") ?? [],
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
