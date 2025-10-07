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
