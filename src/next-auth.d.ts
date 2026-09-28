import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      displayName?: string;
      solvedProblemIds?: number[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    displayName?: string;
    username?: string;
    solvedProblemIds?: number[];
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    displayName?: string;
    username?: string;
    solvedProblemIds?: number[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    displayName?: string;
    username?: string;
    solvedProblemIds?: number[];
  }
}
