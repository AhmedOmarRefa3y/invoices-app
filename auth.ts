import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const credentialsConfig = CredentialsProvider({
    name: "Credentials",
    credentials: {
        userName: {
            label: "User Name",
        },
        password: {
            label: "Password",
            type: "password",
        },
    },
    async authorize(credentials) {
        if (credentials.userName === "sk" && credentials.password === "123")
            return {
                name: "Vahid",
                custom: "aaa",
            };
        else return null;
    },
});

const config = {
    pages: {
        signIn: "/login",
    },
    providers: [credentialsConfig],
    callbacks: {
        session({ session, token }) {
            if (session) {
                session.user.customer = token.custom;
            }
            return session;
        },
        jwt({ token, user, profile }) {
            return token;
        },
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
