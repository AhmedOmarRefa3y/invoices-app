import prismaDb from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { GetUser } from "./actions/getUser";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // @ts-ignore
    adapter: PrismaAdapter(prismaDb),
    trustHost: true,
    callbacks: {
        session({ session, user }) {
            session.user.role = user.role;
            return session;
        },
    },
    providers: [
        credentials({
            async authorize(credentials) {
                const user = await GetUser(credentials?.email as string);
                console.log(user);

                if (!user) {
                    console.log(user);
                    return null;
                }
                if (!credentials?.password || !user || !user.password) {
                    console.log(user);
                    return null;
                }
                const passwordCorrect = await bcrypt.compare(
                    credentials?.password as string,
                    user?.password
                );

                if (passwordCorrect) {
                    console.log(user);
                    return user;
                }

                return null;
            },
        }),
        Google,
        Twitter({
            clientId: process.env.AUTH_TWITTER_ID,
            clientSecret: process.env.AUTH_TWITTER_SECRET,
        }),
    ],
});
