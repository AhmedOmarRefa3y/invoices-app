import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { GetUser } from "@/lib/getUser";
import prismaDb from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as string;
            return session;
        },
        async jwt({ token, user, profile }) {
            const userD = await GetUser(token?.userName as string);
            token.role = userD?.role;
            return token;
        },
    },
    adapter: PrismaAdapter(prismaDb),
    session: { strategy: "jwt" },
    ...authConfig,
});
