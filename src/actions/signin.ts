"use server";
import { signIn } from "@/auth";

export async function signInAction({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    try {
        const response = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });

        return {
            status: "ok",
            message: "logged in successfully",
            data: response,
        };
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            message: "something went wrong",
            data: null,
        };
    }
}
