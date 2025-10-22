"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";

interface JournalTransactionLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  accountName: string;
  accountCode?: string;
  description: string;
  debit: number;
  credit: number;
  date: Date;
  reference: string | null;
  balanceAfter: number; // Running balance after this transaction
  entryNumber: number;
  normalSide: "DEBIT" | "CREDIT"; // The normal side for the account
}

export async function getJournalTransactions(orgId: string, code?: string) {
  console.log(code);

  try {
    const user = await auth();
    if (!user?.user) {
      throw new Error("Unauthorized access");
    }

    const lines = await prismaDb.journalEntryLine.findMany({
      where: {
        organizationId: orgId,
        account: {
          code: code,
        },
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            code: true,
            normalSide: true,
          },
        },
        journal: {
          select: {
            date: true,
            number: true,
          },
        },
      },
      orderBy: [
        {
          journal: {
            date: "asc",
          },
        },
        {
          journal: {
            number: "asc",
          },
        },
      ],
    });

    let newBalance = 0;

    const linesWithBalances = lines.map((line) => {
      newBalance = newBalance + line.debit - line.credit;
      return {
        id: line.id,
        journalEntryId: line.id,
        accountId: line.accountId,
        accountName: line.account.name,
        accountCode: line.account.code,
        description: line.description || line.description || "",
        debit: line.debit,
        credit: line.credit,
        date: line.journal.date,
        reference: line.reference,
        balanceAfter: newBalance,
        entryNumber: line.journal.number,
        normalSide: line.account.normalSide,
      };
    });
    return {
      success: true,
      data: linesWithBalances,
    };
  } catch (error) {
    console.error("Error fetching journal transactions:", error);
    return {
      success: false,
      error: "Failed to fetch journal transactions",
      data: [],
    };
  }
}
