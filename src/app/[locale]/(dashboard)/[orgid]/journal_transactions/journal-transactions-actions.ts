"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";

// Define types for our journal transaction data
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
  reference?: string;
  balanceAfter: number; // Running balance after this transaction
  entryNumber: number;
  normalSide: "DEBIT" | "CREDIT"; // The normal side for the account
}

export async function getJournalTransactions(orgId: string, accountID?: string) {
  try {
    // Check user authentication
    const user = await auth();
    if (!user?.user) {
      throw new Error("Unauthorized access");
    }

    // Fetch journal entries, their lines, and account information with normal side
    const journalEntries = await prismaDb.journalEntry.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        lines: {
          include: {
            account: {
              select: {
                id: true,
                name: true,
                code: true,
                normalSide: true, // Get the normal side for balance calculation
              },
            },
          },
        },
      },
      orderBy: [
        { date: "asc" }, // Order by date first
        { number: "asc" }, // Then by entry number
      ],
    });

    // Get all accounts for the organization to initialize balances
    const accounts = await prismaDb.ledgerAccount.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        normalSide: true,
      },
    });

    // Initialize balance tracking - each account starts with a balance of 0
    const accountBalances = new Map<string, number>();
    accounts.forEach((account) => {
      accountBalances.set(account.id, 0);
    });

    // Process the entries to create transactions with running balances
    const transactions: JournalTransactionLine[] = [];

    for (const entry of journalEntries) {
      // Process each line in the journal entry
      for (const line of entry.lines) {
        // Calculate the new balance for this account based on normal side
        const accountId = line.accountId;
        const currentBalance = accountBalances.get(accountId) || 0;
        const debitAmount = Number(line.debit);
        const creditAmount = Number(line.credit);
        const normalSide = line.account.normalSide;

        // Calculate new balance depending on account's normal side
        // For DEBIT normal side: debits increase balance, credits decrease
        // For CREDIT normal side: credits increase balance, debits decrease
        let newBalance = currentBalance;
        if (normalSide === "DEBIT") {
          newBalance = currentBalance + debitAmount - creditAmount;
        } else {
          // normalSide === "CREDIT"
          newBalance = currentBalance - debitAmount + creditAmount;
        }

        accountBalances.set(accountId, newBalance);

        // Add the transaction to our list
        transactions.push({
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
          balanceAfter: newBalance,
          entryNumber: entry.number,
          normalSide: normalSide,
        });
      }
    }

    // Sort transactions by date and entry number to ensure proper order
    transactions.sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime();
      if (dateCompare !== 0) {
        return dateCompare;
      }
      return a.entryNumber - b.entryNumber;
    });

    return {
      success: true,
      data: transactions,
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

// Server action to get transactions for a specific account
export async function getJournalTransactionsByAccount(orgId: string, accountId: string) {
  try {
    const user = await auth();
    if (!user?.user) {
      throw new Error("Unauthorized access");
    }

    const journalEntries = await prismaDb.journalEntry.findMany({
      where: {
        organizationId: orgId,
        posted: true, // Only include posted entries
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
