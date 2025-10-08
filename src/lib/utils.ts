import { getNextOrganizationNumber } from "@/actions";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getNextInvoiceNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastInvoiceNumber");

export const getNextPaymentNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPaymentNumber");

export const getNextProductionPlanNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastProductionPlanNumber");

export const getNextProductionEventNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastProductionEventNumber");

export const getNextPurchaseInvoiceNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPurchaseInvoiceNumber");

export const getNextReturnedInvoiceNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastReturnedInvoiceNumber");

export const getNextPaymentToSupplierNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastPaymentToSupplierNumber");

export const getNextJournalEntryNumber = (organizationId: string) =>
  getNextOrganizationNumber(organizationId, "lastJournalEntryNumber");
