"use server";

import prismaDb from "@/lib/prisma";
import { hash } from "bcrypt";

const Register = async ({
    userName,
    password,
}: {
    userName: string;
    password: string;
}) => {
    try {
        const IsUSerNameExist = await prismaDb.user.findUnique({
            where: {
                userName: userName,
            },
        });
        if (IsUSerNameExist) {
            throw new Error("This User Name Is Taken");
        }

        const hashedPassword = await hash(password, 10);
        const user = await prismaDb.user.create({
            data: {
                userName,
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
