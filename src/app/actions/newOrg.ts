"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "auth";
import { revalidateApp } from "./customer";

export async function CreateOrg(Data: { OrgName: string }) {
    const user = await auth();
    console.log(user?.user.id, Data.OrgName);

    try {
        if (!Data.OrgName) {
            throw new Error("Org Name is required");
        }
        const NewOrg = await prismaDb.organization.create({
            data: {
                name: Data.OrgName,
                owner: {
                    connect: {
                        id: user?.user.id,
                    },
                },
            },
        });
        if (!NewOrg) {
            throw new Error("Failed to create NewOrg");
        }
        revalidateApp();
        return {
            status: "ok",
            message: "NewOrg created successfully",
            Data: NewOrg,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating NewOrg",
        };
    }
}
