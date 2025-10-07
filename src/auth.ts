import prismaDb from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { GetUser, GetUserByID } from "./actions/(auth)/user";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production" ? `app2-prod-session-token` : `app2-dev-session-token`;
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prismaDb),
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      // other options
    },
  },
  trustHost: true,

  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        const user = await GetUserByID(token.sub);
        session.user.id = token.sub as string;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        session.user.role = user?.role || "user";
        return session;
      }

      return session;
    },
  },

  providers: [
    credentials({
      name: "credentials",

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("email and password are required");
          }
          const user = await GetUser(credentials.email as string);

          if (!user) {
            throw new Error("user not found");
          }
          if (!user.password) {
            throw new Error(" user is alraedy registered with oauth");
          }
          if (user) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password as string,
              user.password
            );

            if (!isPasswordValid) {
              throw new Error("password is incorrect, please try again");
            } else {
              return user;
            }
          }

          throw new Error("something went wrong");
        } catch (error) {
          if (error instanceof Error) {
            console.log("Authorization error:", error.message);

            throw error;
          } else {
            throw new Error("An unexpected error occurred");
          }
        }
      },
    }),
    Google,
  ],
});
