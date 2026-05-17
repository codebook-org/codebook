import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { syncOAuth } from "@/lib/auth-actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // CredentialsProvider({
    //     async authorize(credentials: string): Promise<void>{

    //     }
    // })
  ],

  callbacks: {
    // We need to be able to handle "updating" OAuth Data.
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email as string;
        const oauthId = account.providerAccountId; // A unique ID

        await syncOAuth(oauthId, email, user.name);

        return true; // Allow sign in
      }

      // If it's Credentials, we assume the user was verified in the 'authorize' function
      return true;
    },

    // When logging in, we'll first grab the profile id.
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const userId = profile.providerAccountId as string; // Updated this to use providerAccountID for consistentcy.
        // Assg to token
        token.id = userId;
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
