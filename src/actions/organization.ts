"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateApp } from "@/actions";
import { createMainLedgerAccountsForOrg } from "@/actions/CreateLedgerAccounts";

export async function CreateOrg(Data: { OrgName: string }) {
  const user = await auth();

  try {
    if (!Data.OrgName) {
      throw new Error("Org Name is required");
    }
    if (!user?.user?.id) {
      throw new Error("user id is required");
    }

    const result = await prismaDb.$transaction(async (tx) => {
      const NewOrg = await tx.organization.create({
        data: {
          name: Data.OrgName,
          owner: {
            connect: { id: user?.user?.id },
          },
        },
      });

      await createMainLedgerAccountsForOrg(NewOrg.id, tx);

      return NewOrg;
    });

    await revalidateApp();

    return {
      status: "ok",
      message: "✅ New organization and ledger accounts created successfully",
      Data: result,
    };
  } catch (error) {
    console.error("❌ Error creating org:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating organization",
    };
  }
}
