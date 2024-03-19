import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { GetUserByID } from "@/app/actions/getUser";
import prismaDb from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
    },
    // basePath: process.env.NEXTAUTH_URL,
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as string;
            session.user.id = token.id as string;
            return session;
        },
        async jwt({ token }) {
            const userD = await GetUserByID(token?.sub as string);
            token.role = userD?.role;
            token.id = userD?.id;
            token.name = userD?.userName;
            return token;
        },
    },
    adapter: PrismaAdapter(prismaDb),
    session: { strategy: "jwt" },
    ...authConfig,
});
