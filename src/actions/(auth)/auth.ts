"use server";

import { signIn } from "@/auth";
import prismaDb from "@/lib/prisma";
import { hash } from "bcryptjs";

export const Register = async ({ email, password }: { email: string; password: string }) => {
  try {
    const EmailExist = await prismaDb.user.findUnique({
      where: {
        email: email,
      },
    });
    if (EmailExist) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await hash(password, 10);
    const user = await prismaDb.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return {
      status: "ok",
      message: "account created succesfully",
      data: user,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "something went wrong while creating an account",
      data: null,
    };
  }
};
export async function signInAction({ email, password }: { email: string; password: string }) {
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
    if (error instanceof Error) {
      return {
        status: "error",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
