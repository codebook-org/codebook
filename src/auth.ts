import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "next-auth/providers/credentials";

import { syncOAuth } from "@/lib/auth-actions";

import { CodebookDatabaseAPI } from "@/lib/db";
import { oldUserByEmail } from "@/lib/auth-actions";

type OldUser = {
  userId: number;
  email: string;
  passwordHash: string;
  username: string;
  displayName?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          let user = await CodebookDatabaseAPI.getUserByEmail(
            credentials.email as string, // Grab email
          );

          if (user && user.passwordHash == credentials.password) {
            return {
              id: user.userId.toString(),
              email: user.email,
              username: user.username, // Use the username (email splice) if we don't have a display at the moment.
              displayName: user.displayName,
              image: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // We need to be able to handle "updating" OAuth Data.
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email as string;
        const oauthId = account.providerAccountId; // The unique OAuth ID

        // We got a user ID from our oAuth id
        const pulledUser = await syncOAuth(oauthId, email, user.name as string);

        // This is all the information we pull from the DB, and we'll be using it to push to the session.
        (user as any).postgresId = pulledUser.userId;
        (user as any).displayName = pulledUser.displayName;
        (user as any).username = pulledUser.username;

        return true; // Allow sign in
      }

      return true;
    },

    // When logging in, we'll first grab the profile id.
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign-in for BOTH OAuth and Credentials
      if (account && user) {
        console.log("JWT Callback - User detected:", user.email);

        // I have no idea why parsing a string to number is so hard...
        const rawId = (user as any).postgresId ?? user.id;
        token.id = parseInt(rawId, 10);

        token.displayName = user.displayName ?? user.username ?? ""; // Absolute fallback

        token.username = (user as any).username;

        console.log("SUCCESS: Token sub assigned:", token.id);
      }

      // If an "update" is triggered, then we'll update.
      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.displayName) token.displayName = session.displayName ?? session.username;
      }
      return token;
    },

    // Then, we make it available to read. We simply just use session.user.id to pull that information.
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = `${token.id}`;

        session.user.displayName = token.displayName as string;
        session.user.username = token.username as string;

        session.user.name = token.username as string; // ABSOLUTE FALLBACK!!!
      }
      return session;
    },
  },
});
