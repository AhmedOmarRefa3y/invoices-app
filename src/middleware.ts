import { auth } from "auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    console.log(req.nextUrl.pathname);
    if (!req.auth) {
        if (
            req.nextUrl.pathname.startsWith("/api/auth") ||
            req.nextUrl.pathname === "/login"
        ) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
    } else {
        return NextResponse.next();
    }
});
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
