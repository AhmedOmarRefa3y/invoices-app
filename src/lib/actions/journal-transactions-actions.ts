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

export async function getJournalTransactions(orgId: string) {
  try {
    const user = await auth();
    if (!user?.user) {
      throw new Error("Unauthorized access");
    }

    const lines = await prismaDb.journalEntryLine.findMany({
      where: {
        organizationId: orgId,
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

export async function getJournalTransactionsByAccount(orgId: string, accountId: string) {
  try {
    const user = await auth();
    if (!user?.user) {
      throw new Error("Unauthorized access");
    }

    const journalEntries = await prismaDb.journalEntry.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        lines: {
          where: {
            accountId: accountId,
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
          },
        },
      },
      orderBy: [{ date: "asc" }, { number: "asc" }],
    });

    // Get the account to know its normal side
    const account = await prismaDb.ledgerAccount.findUnique({
      where: {
        id: accountId,
      },
      select: {
        normalSide: true,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Initialize running balance
    let runningBalance = 0;
    const normalSide = account.normalSide;
    const accountTransactions: JournalTransactionLine[] = [];

    for (const entry of journalEntries) {
      for (const line of entry.lines) {
        const debitAmount = Number(line.debit);
        const creditAmount = Number(line.credit);

        // Calculate new balance based on normal side
        if (normalSide === "DEBIT") {
          runningBalance = runningBalance + debitAmount - creditAmount;
        } else {
          // normalSide === "CREDIT"
          runningBalance = runningBalance - debitAmount + creditAmount;
        }

        accountTransactions.push({
          id: line.id,
          journalEntryId: entry.id,
          accountId: line.accountId,
          accountName: line.account.name,
          accountCode: line.account.code,
          description: line.description || entry.description || "",
          debit: debitAmount,
          credit: creditAmount,
          date: entry.date,
          reference: line.reference,
          balanceAfter: runningBalance,
          entryNumber: entry.number,
          normalSide: normalSide,
        });
      }
    }

    return {
      success: true,
      data: accountTransactions,
    };
  } catch (error) {
    console.error("Error fetching journal transactions by account:", error);
    return {
      success: false,
      error: "Failed to fetch journal transactions",
      data: [],
    };
  }
}
