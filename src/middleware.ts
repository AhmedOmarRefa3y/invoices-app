import { auth } from "auth";

export default auth((req) => {
    console.log(!!req.auth);
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
