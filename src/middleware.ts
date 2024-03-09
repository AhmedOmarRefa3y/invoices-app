import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./../auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    if (!req.auth) {
        if (
            req.nextUrl.pathname.startsWith("/api/auth") ||
            req.nextUrl.pathname === "/login" ||
            req.nextUrl.pathname === "/register"
        ) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url));
    } else {
        return NextResponse.next();
    }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
