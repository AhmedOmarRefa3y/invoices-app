import {
  SaveInvoice,
  UpdateInvoice,
  UpdateReturnsInvoice,
  saveInvoiceType,
} from "@/actions/invoice";
import prismaDb from "@/lib/prisma";
import { Store } from "@/lib/zustand/invoiceStore";
import { ReturnsStore } from "@/lib/zustand/ReturnsInvoice";

import toast from "react-hot-toast";

export const GetSalesData = async (orgID: string) => {
  const customers = await prismaDb.customer.findMany({
    where: {
      organizationId: orgID,
    },
    include: {
      invoices: true,
      Payment: true,
      ReturnedInvoice: true,
      PurchaseInvoice: true,
    },
    orderBy: {
      name: "asc",
    },
    distinct: ["name"],
  });
  const products = await prismaDb.product.findMany({
    where: {
      organizationId: orgID,
    },
    include: {
      Part: {
        select: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
          name: true,
          partProductId: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    distinct: ["name"],
  });

  const CustomersWithBalances = customers.map((customer) => {
    let InvoiceTotal = 0;
    customer.invoices.forEach((invoice) => {
      InvoiceTotal += invoice.amount;
    });
    let TotalPayments = 0;
    customer.Payment.forEach((payment) => {
      TotalPayments += payment.amount;
    });
    let REtInvTotal = 0;
    customer.ReturnedInvoice.forEach((REtInv) => {
      REtInvTotal += REtInv.amount;
    });
    let PurchasesTotal = 0;
    customer.PurchaseInvoice.forEach((purchInv) => {
      PurchasesTotal += purchInv.amount;
    });

    return {
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      location: customer.location,
      CustomerCredit: customer.CustomerCredit,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      organizationId: customer.organizationId,
      TotalPayments,
      InvoiceTotal,
      REtInvTotal,
      IsASupplier: customer.IsASupplier,
      openCredit: customer.CustomerCredit,
      Currbalance:
        InvoiceTotal -
        (TotalPayments + REtInvTotal + PurchasesTotal) +
        customer.CustomerCredit,
    };
  });

  return {
    CustomersWithBalances,
    products,
    customers,
  };
};

export interface InvoiceData {
  invoiceId?: string;
  customerId: string | null;
  date: Date;
  Items: {
    id: string;
    quantity: number;
    price: number;
  }[];
  invoiceAmount: number;
  paidAmount?: number;
}
export const SaveSalesInvoice = async (
  Invoice: InvoiceData,
  setloading: (sate: boolean) => void,
  redirect: (num: number | string) => void,
  orgid: string,
  setpaidAmount: (value: number) => void,
  clearData: () => void
) => {
  setloading(true);
  const { paidAmount, invoiceAmount, customerId, date, Items } = Invoice;
  let InvoiceItems: {
    id: string;
    quantity: number;
    price: number;
  }[] = [];

  Items.map((item) => {
    if (item.quantity > 0) {
      InvoiceItems.push({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      });
    }
  });

  if (!customerId) {
    toast.error("You must select a customer");
    setloading(false);
    return;
  }
  const data: saveInvoiceType = {
    customerId: customerId,
    date: date,
    invoiceAmount: invoiceAmount,
    InvoiceItems,
    paidAmount: paidAmount || 0,
    orgid,
  };

  if (InvoiceItems.length > 0) {
    const res = await SaveInvoice(data);
    if (res.status === "ok") {
      clearData();
      setpaidAmount(0);
      redirect(`/${orgid}/sales/showInvoice/${res.data?.number}`);
      toast.success("Invoice saved successfully");
    } else {
      toast.error(res.message);
      setloading(false);
    }
  } else {
    toast.error("No items have been added to the invoice");
    setloading(false);
  }
};

export const UpadteSalesInvoice = async (
  Invoice: Store,
  setloading: (sate: boolean) => void,
  redirect: (num: any) => void,
  orgid: string
) => {
  setloading(true);
  const {
    paidAmount,
    setpaidAmount,
    InvoiceId,
    invoiceAmount,
    customerId,
    date,
  } = Invoice;
  let InvoiceItems: {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
  }[] = [];

  Invoice.items.map((item) => {
    if (item.quantity > 0) {
      InvoiceItems.push(item);
    }
  });

  if (!customerId) {
    toast.error("You must select a customer");
    setloading(false);
    return;
  }
  if (!InvoiceId) {
    toast.error("You must select an invoice");
    setloading(false);
    return;
  }
  const data: {
    Id: string;
    customerId: string;
    date: Date;
    InvoiceItems: {
      id: string;
      quantity: number;
      price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
    orgid: string;
  } = {
    Id: InvoiceId,
    customerId: customerId,
    date: date,
    invoiceAmount: invoiceAmount,
    InvoiceItems,
    paidAmount: paidAmount,
    orgid,
  };

  if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
    const res = await UpdateInvoice(data);
    if (res.status === "ok") {
      Invoice.clearData();
      setpaidAmount(0);
      redirect(`/${orgid}/sales/showInvoice/${res.data?.number}`);
      toast.success("Invoice updated successfully");
    } else {
      toast.error(res.message);
      setloading(false);
    }
  } else {
    toast.error("Invoice was not modified");
    setloading(false);
  }
};

export const UpadteReturnsInvoice = async (
  Invoice: ReturnsStore,
  setloading: (sate: boolean) => void,
  redirect: (num: any) => void,
  orgid: string
) => {
  setloading(true);
  const {
    paidAmount,
    setpaidAmount,
    InvoiceId,
    invoiceAmount,
    customerId,
    date,
  } = Invoice;
  let InvoiceItems: {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
  }[] = [];

  Invoice.items.map((item) => {
    if (item.quantity > 0) {
      InvoiceItems.push(item);
    }
  });

  if (!customerId) {
    toast.error("You must select a customer");
    setloading(false);
    return;
  }
  if (!InvoiceId) {
    toast.error("You must select an invoice");
    setloading(false);
    return;
  }
  const data: {
    Id: string;
    customerId: string;
    date: Date;
    InvoiceItems: {
      id: string;
      quantity: number;
      price: number;
    }[];
    invoiceAmount: number;
    paidAmount: number;
    orgid: string;
  } = {
    Id: InvoiceId,
    customerId: customerId,
    date: date,
    invoiceAmount: invoiceAmount,
    InvoiceItems,
    paidAmount: paidAmount,
    orgid,
  };

  if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
    const res = await UpdateReturnsInvoice(data);
    if (res.status === "ok") {
      Invoice.clearData();
      setpaidAmount(0);
      redirect(
        `/${orgid}/returnedInvoices/showInvoice?num=${res.data?.number}`
      );
      toast.success("Invoice updated successfully");
    } else {
      toast.error(res.message);
      setloading(false);
    }
  } else {
    toast.error("Invoice was not modified");
    setloading(false);
  }
};
