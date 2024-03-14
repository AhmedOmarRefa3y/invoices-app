// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { compare } from "bcrypt";
// import prismaDb from "@/lib/prisma";

// const handler = NextAuth({
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/login",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 userName: {},
//                 password: {},
//             },
//             async authorize(credentials, req) {
//                 // console.log(credentials);
//                 const user = await prismaDb.user.findFirst({
//                     where: {
//                         userName: credentials?.userName,
//                     },
//                 });
//                 // console.log(user);
//                 if (!user) {
//                     return null;
//                 }
//                 if (!credentials?.password || !user) {
//                     return null;
//                 }
//                 const passwordCorrect = await compare(
//                     credentials?.password as string,
//                     user?.password
//                 );
//                 if (passwordCorrect) {
//                     return {
//                         id: user?.id,
//                         userName: user?.userName,
//                     };
//                 }

//                 return null;
//             },
//         }),
//     ],
// });

// export { handler as GET, handler as POST };

import { handlers } from "auth";

export const { GET, POST } = handlers;
