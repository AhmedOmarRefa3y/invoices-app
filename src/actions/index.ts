"use server";
import prismaDb from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const revalidateApp = async () => {
  revalidatePath("/accounts-reports");
  revalidatePath("/accounts-reports/customer-credit");
  revalidatePath("/accounts-reports/account-statement");
  revalidatePath("/accounts-reports/customer-credit-with-items");
  revalidatePath("/add-sales-invoice");
  revalidatePath("/add-returns-invoice");
  revalidatePath("/inventory/");
  revalidatePath("/inventory/composed-items");
  revalidatePath("/inventory/product-records");
  revalidatePath("/sales");
  revalidatePath("/sales/showInvoice");
  revalidatePath("/sales/releaseorder");
  revalidatePath("/Payments");
  revalidatePath("/returnedInvoices");
  revalidatePath("/returnedInvoices/showREtInvoice");
  revalidatePath("/", "layout");
};

type NumberField =
  | "lastInvoiceNumber"
  | "lastPaymentNumber"
  | "lastProductionPlanNumber"
  | "lastProductionEventNumber"
  | "lastPurchaseInvoiceNumber"
  | "lastReturnedInvoiceNumber"
  | "lastPaymentToSupplierNumber"
  | "lastJournalEntryNumber";

export async function getNextOrganizationNumber(
  organizationId: string,
  field: NumberField
): Promise<number> {
  return await prismaDb.$transaction(async (tx) => {
    const updatedOrg = await tx.organization.update({
      where: { id: organizationId },
      data: { [field]: { increment: 1 } },
    });

    const nextNumber = updatedOrg[field];

    if (nextNumber === null || nextNumber === undefined) {
      throw new Error(`Field ${field} is null or undefined`);
    }

    return nextNumber;
  });
}

export const getNextInvoiceNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastInvoiceNumber");

export const getNextPaymentNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPaymentNumber");

export const getNextProductionPlanNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastProductionPlanNumber");

export const getNextProductionEventNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastProductionEventNumber");

export const getNextPurchaseInvoiceNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPurchaseInvoiceNumber");

export const getNextReturnedInvoiceNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastReturnedInvoiceNumber");

export const getNextPaymentToSupplierNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPaymentToSupplierNumber");

export const getNextJournalEntryNumber = async (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastJournalEntryNumber");
