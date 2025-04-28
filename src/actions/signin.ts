"use server";
import { signIn } from "@/auth";

export async function signInAction({ email, password }: { email: string; password: string }) {
  try {
    const response = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    console.log(response);
    return {
      status: "ok",
      message: "logged in successfully",
      data: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "error",
        // @ts-ignore
        message: error.cause.err.message,
        data: null,
      };
    } else {
      console.log(error);
      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
