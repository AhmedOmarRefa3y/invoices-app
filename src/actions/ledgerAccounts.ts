"use server";

import prismaDb from "@/lib/prisma";

export async function getLedgerAccounts(organizationId: string) {
  try {
    const accounts = await prismaDb.ledgerAccount.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        code: "asc",
      },
    });

    return {
      status: "ok",
      data: accounts,
    };
  } catch (error) {
    console.error("Error fetching ledger accounts:", error);
    return {
      status: "error",
      message: "Failed to fetch ledger accounts",
      data: null,
    };
  }
}