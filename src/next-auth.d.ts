import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      displayName?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    displayName?: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    display_name?: string;
    username?: string;
  }
}
