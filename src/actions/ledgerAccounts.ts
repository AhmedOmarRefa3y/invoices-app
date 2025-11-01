"use server";

import { LedgerAccount } from "@prisma/client";
import { z } from "zod";
import prismaDb from "@/lib/prisma";
import { revalidateApp } from "@/actions";

interface LedgerAccountNode extends LedgerAccount {
  children: LedgerAccountNode[];
}

// Zod schemas for validation
const AccountSchema = z.object({
  code: z.string().optional().nullable(),
  name: z.string().min(1, "Account name is required"),
  type: z.enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"]),
  normalSide: z.enum(["DEBIT", "CREDIT"]),
  parentId: z.string().nullable(),
  organizationId: z.string().min(1, "Organization ID is required"),
});

const UpdateAccountSchema = AccountSchema.extend({
  id: z.string().min(1, "Account ID is required"),
  code: z.string().min(1, "Account code is required"),
});

export async function getAccountsTree(organizationId: string) {
  try {
    // Get all accounts for the organization
    const accounts = await prismaDb.ledgerAccount.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        code: "asc",
      },
    });

    // Build a map of accounts for easy access
    const accountMap = new Map<string, LedgerAccountNode>(
      accounts.map((account) => [account.id, { ...account, children: [] as LedgerAccountNode[] }])
    );
    // Build the tree structure
    const rootAccounts = [];

    for (const account of accounts) {
      const currentAccount = accountMap.get(account.id);
      if (currentAccount) {
        if (account.parentId) {
          const parentAccount = accountMap.get(account.parentId);
          if (parentAccount) {
            parentAccount.children.push(currentAccount);
          }
        } else {
          rootAccounts.push(currentAccount);
        }
      }
    }

    return rootAccounts;
  } catch (error) {
    console.error("Error fetching accounts tree:", error);
    throw new Error("Failed to fetch accounts tree");
  }
}

export async function createAccount(data: z.infer<typeof AccountSchema>) {
  try {
    const validatedData = AccountSchema.parse(data);

    // Check if code already exists
    if (validatedData.code) {
      const existingAccount = await prismaDb.ledgerAccount.findFirst({
        where: {
          code: validatedData.code,
          organizationId: validatedData.organizationId,
        },
      });
      if (existingAccount) {
        throw new Error("Account code already exists");
      }
    }

    console.log("Validated Data:", validatedData);

    let parentAccount = null;

    if (validatedData.parentId) {
      parentAccount = await prismaDb.ledgerAccount.findUnique({
        where: { id: validatedData.parentId },
        include: { children: true },
      });
    }
    // Create the new account
    const newAccount = await prismaDb.ledgerAccount.create({
      data: {
        code: `${
          parentAccount
            ? parentAccount.code + (parentAccount.children.length + 1)
            : validatedData.code
        }`,
        name: validatedData.name,
        type: validatedData.type,
        normalSide: validatedData.normalSide,
        parentId: validatedData.parentId,
        organizationId: validatedData.organizationId,
        isLeaf: true, // Initially, new accounts are leaf nodes unless they get children
      },
    });

    // If the new account has a parent, update the parent to not be a leaf
    if (validatedData.parentId) {
      await prismaDb.ledgerAccount.update({
        where: { id: validatedData.parentId },
        data: { isLeaf: false },
      });
    }

    revalidateApp();
    return newAccount;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    console.error("Error creating account:", error);
    throw new Error("Failed to create account");
  }
}

export async function updateAccount(accountId: string, data: z.infer<typeof UpdateAccountSchema>) {
  try {
    const validatedData = UpdateAccountSchema.parse({ ...data, id: accountId });

    // Check if account code already exists for a different account
    const existingAccount = await prismaDb.ledgerAccount.findFirst({
      where: {
        code: validatedData.code,
        organizationId: validatedData.organizationId,
        id: { not: validatedData.id }, // Exclude the current account
      },
    });

    if (existingAccount) {
      throw new Error("Account code already exists");
    }

    // Get the current account to check for parent changes
    const currentAccount = await prismaDb.ledgerAccount.findUnique({
      where: { id: accountId },
    });

    if (!currentAccount) {
      throw new Error("Account not found");
    }

    // Update the account
    const updatedAccount = await prismaDb.ledgerAccount.update({
      where: { id: accountId },
      data: {
        code: validatedData.code,
        name: validatedData.name,
        type: validatedData.type,
        normalSide: validatedData.normalSide,
        parentId: validatedData.parentId,
      },
    });

    // If the parent was changed, update the old parent to be a leaf if it has no other children
    if (currentAccount.parentId && currentAccount.parentId !== validatedData.parentId) {
      // Check if the old parent has any other children
      const oldParentChildren = await prismaDb.ledgerAccount.count({
        where: {
          parentId: currentAccount.parentId,
          id: { not: accountId },
        },
      });

      if (oldParentChildren === 0) {
        await prismaDb.ledgerAccount.update({
          where: { id: currentAccount.parentId },
          data: { isLeaf: true },
        });
      }
    }

    // If the account now has a new parent, update the new parent to not be a leaf
    if (validatedData.parentId) {
      await prismaDb.ledgerAccount.update({
        where: { id: validatedData.parentId },
        data: { isLeaf: false },
      });
    }

    revalidateApp();
    return updatedAccount;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    console.error("Error updating account:", error);
    throw new Error("Failed to update account");
  }
}

export async function deleteAccount(accountId: string) {
  try {
    // Check if account has children
    // const childAccounts = await prismaDb.ledgerAccount.count({
    //   where: { parentId: accountId },
    // });

    // if (childAccounts > 0) {
    //   throw new Error(
    //     "Cannot delete account with children. Please remove or reassign children first."
    //   );
    // }

    // Get the account to check its parent
    const account = await prismaDb.ledgerAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Delete the account
    await prismaDb.ledgerAccount.delete({
      where: { id: accountId },
    });

    // If the deleted account had a parent, check if the parent is now a leaf
    if (account.parentId) {
      const remainingChildren = await prismaDb.ledgerAccount.count({
        where: { parentId: account.parentId },
      });

      if (remainingChildren === 0) {
        await prismaDb.ledgerAccount.update({
          where: { id: account.parentId },
          data: { isLeaf: true },
        });
      }
    }

    revalidateApp();
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }
}

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
