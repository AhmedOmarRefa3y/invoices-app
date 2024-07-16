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
    // callbacks: {
    //     session({ session, user }) {
    //         session.user.id = user.id;
    //         return session;
    //     },
    // },
    session: {
        strategy: "jwt",
    },
    providers: [
        credentials({
            async authorize(credentials) {
                try {
                    const user = await GetUser(credentials?.email as string);

                    if (user) {
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
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            },
        }),
        Google,
    ],
});
