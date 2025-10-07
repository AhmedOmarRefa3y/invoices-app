"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customers";
import { auth } from "@/auth";

export async function CreateOrg(Data: { OrgName: string }) {
  const user = await auth();

  try {
    if (!Data.OrgName) {
      throw new Error("Org Name is required");
    }
    if (!user?.user?.id) {
      throw new Error("user id is required");
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
    console.log(error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating NewOrg",
    };
  }
}
