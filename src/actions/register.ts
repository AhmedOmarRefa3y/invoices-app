"use server";

import prismaDb from "@/lib/prisma";
import { hash } from "bcryptjs";

const Register = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    try {
        const IsUSerNameExist = await prismaDb.user.findUnique({
            where: {
                email: email,
            },
        });
        if (IsUSerNameExist) {
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
                error instanceof Error
                    ? error.message
                    : "something went wrong while creating an account",
            data: null,
        };
    }
};

export default Register;
