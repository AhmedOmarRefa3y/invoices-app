"use server";

import prismaDb from "@/lib/prisma";
import { getNextJournalEntryNumber, revalidateApp } from "./index";
import { auth } from "@/auth";

import * as z from "zod";

const JournalLineSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  description: z.string().optional(),
  debit: z.number().min(0, "Debit must be non-negative"),
  credit: z.number().min(0, "Credit must be non-negative"),
  currency: z.string().optional(),
  reference: z.string().optional(),
});

const CreateJournalEntrySchema = z.object({
  orgid: z.string().min(1, "Organization ID is required"),
  date: z.coerce.date(), // converts string → Date automatically
  description: z.string().optional(),
  lines: z
    .array(JournalLineSchema)
    .min(1, "At least one line is required")
    .superRefine((lines, ctx) => {
      const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
      const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

      // Allow small rounding differences
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debits must equal credits",
        });
      }
    }),
});

export const CreateJournalEntry = async (
  JournalEntryData: z.infer<typeof CreateJournalEntrySchema>
) => {
  const session = await auth();
  if (!session?.user) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  try {
    // ✅ Validate incoming data
    const parsed = CreateJournalEntrySchema.parse(JournalEntryData);
    const { orgid, date, description, lines } = parsed;

    // ✅ Get next journal entry number
    const org = await prismaDb.organization.findUnique({
      where: { id: orgid },
      select: { lastJournalEntryNumber: true },
    });

    const nextNumber = await getNextJournalEntryNumber(orgid);

    // ✅ Create journal entry
    const journalEntry = await prismaDb.journalEntry.create({
      data: {
        organizationId: orgid,
        number: nextNumber,
        date: new Date(date),
        description: description || "",
        createdBy: session.user.id,
        lines: {
          create: lines.map((line) => ({
            accountId: line.accountId,
            description: line.description || "",
            debit: line.debit,
            credit: line.credit,
            currency: line.currency || "EGP",
            reference: line.reference || "",
            organizationId: orgid,
          })),
        },
      },
      include: { lines: true },
    });

    await revalidateApp();

    return {
      status: "ok",
      message: "Journal entry created successfully",
      data: journalEntry,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message: `Validation failed: ${error.errors[0].message}`,
      };
    }

    console.error("Error creating journal entry:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while creating the journal entry",
    };
  }
};

export const EditJournalEntry = async (JournalEntryData: {
  orgid: string;
  journalEntryId: string;
  date: Date;
  description?: string;
  lines: {
    id?: string;
    accountId: string;
    description?: string;
    debit: number;
    credit: number;
    currency?: string;
    reference?: string;
  }[];
}) => {
  const session = await auth();
  if (!session?.user) {
    return {
      status: "error",
      message: "Not authenticated",
    };
  }

  try {
    const { orgid, journalEntryId, date, description, lines } = JournalEntryData;

    // Validate that debits equal credits
    const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      // Allow small rounding differences
      return {
        status: "error",
        message: "Debits must equal credits",
      };
    }

    // Update journal entry
    const updatedJournalEntry = await prismaDb.$transaction(async (tx) => {
      // First, delete existing lines
      await tx.journalEntryLine.deleteMany({
        where: { journalId: journalEntryId },
      });

      // Then create the updated journal entry with new lines
      const updatedEntry = await tx.journalEntry.update({
        where: { id: journalEntryId },
        data: {
          date: new Date(date),
          description: description || "",
          lines: {
            create: lines.map((line) => ({
              accountId: line.accountId,
              description: line.description || "",
              debit: line.debit || 0,
              credit: line.credit || 0,
              currency: line.currency || "USD",
              reference: line.reference || "",
              organizationId: orgid,
            })),
          },
        },
        include: {
          lines: true,
        },
      });

      return updatedEntry;
    });

    await revalidateApp();

    return {
      status: "ok",
      message: "Journal entry updated successfully",
      data: updatedJournalEntry,
    };
  } catch (error: any) {
    console.error("Error updating journal entry:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while updating the journal entry",
    };
  }
};

export const getJournalEntryById = async (id: string) => {
  try {
    const journalEntry = await prismaDb.journalEntry.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    // Convert Decimal fields to numbers for serialization
    if (journalEntry) {
      const serializedJournalEntry = {
        ...journalEntry,
        lines: journalEntry.lines.map((line) => ({
          ...line,
          debit: Number(line.debit),
          credit: Number(line.credit),
          exchangeRate: line.exchangeRate ? Number(line.exchangeRate) : null,
        })),
      };
      return {
        status: "ok",
        data: serializedJournalEntry,
      };
    }

    return {
      status: "ok",
      data: null,
    };
  } catch (error: any) {
    console.error("Error fetching journal entry:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while fetching the journal entry",
    };
  }
};

export const deleteJournalEntry = async (id: string, orgid: string) => {
  try {
    await prismaDb.journalEntry.delete({
      where: { id },
    });

    await revalidateApp();

    return {
      status: "ok",
      message: "Journal entry deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting journal entry:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while deleting the journal entry",
    };
  }
};
