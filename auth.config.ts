var bcrypt = require("bcryptjs");
import { GetUser } from "@/lib/getUser";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await GetUser(credentials?.userName as string);
                if (!user) {
                    console.log("no user");
                    return null;
                }
                if (!credentials?.password || !user) {
                    return null;
                }
                const passwordCorrect = await bcrypt.compare(
                    credentials?.password as string,
                    user?.password
                );
                console.log(passwordCorrect);

                if (passwordCorrect) {
                    return {
                        name: user.role,
                        sub: user.id,
                        role: user.role,
                    };
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
