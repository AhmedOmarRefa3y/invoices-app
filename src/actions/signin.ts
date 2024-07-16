"use server";
import { signIn } from "@/auth";

export async function signInAction({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    const response = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
    });

    console.log(response);

    return response;
}
