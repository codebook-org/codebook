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
          let user =
            await CodebookDatabaseAPI.getUserByEmail(
              credentials.email as string, // Grab email
            );

          if (user && user.passwordHash == credentials.password) {
            return {
              id: user.userId.toString(),
              email: user.email,
              name: user.displayName || user.username, // Use the username (email splice) if we don't have a display at the moment.
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
        const userId = await syncOAuth(oauthId, email, user.name as string);
        
        // For now, let's tuck the 
        (user as any).postgresId = userId;

        return true; // Allow sign in
      }

      return true;
    },

    // When logging in, we'll first grab the profile id.
    async jwt({ token, user, account }) {
      // Initial sign-in for BOTH OAuth and Credentials
      if (account && user) {
        // Use the ID given to us from the DB, whether we gained it from credentials or oAuth.
        console.log("JWT Callback - User detected:", user.email);
        token.id = (user as any).postgresId.toString() ?? user.id;

        console.log("SUCCESS: Token ID/User ID assigned:", token.id);
      }
      return token;
    },
    
    // Then, we make it available to read. We simply just use session.user.id to pull that information.
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
