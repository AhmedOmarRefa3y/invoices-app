import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { GetUser, GetUserByID } from "@/lib/getUser";
import prismaDb from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            session.user.role = token.role as string;
            session.user.id = token.id as string;
            return session;
        },
        async jwt({ token, user, profile }) {
            console.log(token);
            const userD = await GetUserByID(token?.sub as string);
            // console.log(userD);
            token.role = userD?.role;
            token.id = userD?.id;
            return token;
        },
    },
    adapter: PrismaAdapter(prismaDb),
    session: { strategy: "jwt" },
    ...authConfig,
});
