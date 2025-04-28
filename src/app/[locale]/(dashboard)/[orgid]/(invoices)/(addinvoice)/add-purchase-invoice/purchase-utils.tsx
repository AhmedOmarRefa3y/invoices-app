import {
  SavePurchase,
  UpdatePurchaseInvoice,
  UpdatePurchaseInvoiceType,
  savePurchaseInvoiceType,
} from "@/actions/purchInvoice";
import prismaDb from "@/lib/prisma";
import { PurchaseInvoiceStore } from "@/lib/zustand/PurchaseStore";
import toast from "react-hot-toast";
import { getTranslations } from "next-intl/server";

export const GetPurchasesData = async (orgID: string) => {
  const customers = await prismaDb.customer.findMany({
    where: {
      organizationId: orgID,
      IsASupplier: true,
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
  });
  const products = await prismaDb.product.findMany({
    where: {
      organizationId: orgID,
      Part: {
        none: {},
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const SuppliersWithBalances = customers.map((customer) => {
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
    let PurchaseTotal = 0;
    customer.PurchaseInvoice.forEach((REtInv) => {
      PurchaseTotal += REtInv.amount;
    });

    return {
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      location: customer.location,
      IsASupplier: customer.IsASupplier,
      CustomerCredit: customer.CustomerCredit,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      organizationId: customer.organizationId,
      TotalPayments,
      InvoiceTotal,
      REtInvTotal,
      PurchaseTotal,
      openCredit: customer.CustomerCredit,
      Currbalance:
        InvoiceTotal - (TotalPayments + REtInvTotal + PurchaseTotal) + customer.CustomerCredit,
    };
  });

  return {
    SuppliersWithBalances,
    products,
  };
};

export const SavePurchaseInvoice = async (
  Invoice: PurchaseInvoiceStore,
  setloading: (sate: boolean) => void,
  redirect: (num: number | string) => void,
  orgid: string
) => {
  const t = await getTranslations("purchaseInvoice");
  setloading(true);
  const {
    PaidAmount,
    SetpaidAmount,
    PurchaseInvoiceAmount,
    PurchaseInvoiceItems,
    SupplierId,
    Date,
  } = Invoice;

  const InvoiceItems: {
    id: string;
    quantity: number;
    price: number;
  }[] = [];

  PurchaseInvoiceItems.map((item) => {
    if (item.quantity > 0) {
      InvoiceItems.push({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
      });
    }
  });

  if (!SupplierId) {
    toast.error(t("errors.chooseSupplier"));
    setloading(false);
    return;
  }

  const data: savePurchaseInvoiceType = {
    SupplierId: SupplierId,
    date: Date,
    invoiceAmount: PurchaseInvoiceAmount,
    InvoiceItems,
    paidAmount: PaidAmount,
    orgid,
  };

  if (InvoiceItems.length > 0) {
    const res = await SavePurchase(data);
    if (res.status === "ok") {
      Invoice.ClearData();
      SetpaidAmount(0);
      redirect(`/${orgid}/purchases_invocies/showInvoice?num=${res.data?.number}`);
      toast.success(t("success.created"));
    } else {
      toast.error(res.message);
      setloading(false);
    }
  } else {
    toast.error(t("errors.addItems"));
    setloading(false);
  }
};

export const UpadtePurchaseInvoice = async (
  Invoice: PurchaseInvoiceStore,
  setloading: (sate: boolean) => void,
  redirect: (num: any) => void,
  orgid: string
) => {
  const t = await getTranslations("purchaseInvoice");
  setloading(true);
  const { PaidAmount, PurchaseInvoiceAmount, SupplierId, Date, InvoiceId } = Invoice;

  const InvoiceItems: {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
  }[] = [];

  Invoice.PurchaseInvoiceItems.map((item) => {
    if (item.quantity > 0) {
      InvoiceItems.push(item);
    }
  });

  if (!SupplierId) {
    toast.error(t("errors.chooseSupplier"));
    setloading(false);
    return;
  }

  if (!InvoiceId) {
    toast.error(t("errors.chooseInvoice"));
    setloading(false);
    return;
  }

  const data: UpdatePurchaseInvoiceType = {
    Id: InvoiceId,
    date: Date,
    paidAmount: PaidAmount,
    invoiceAmount: PurchaseInvoiceAmount,
    InvoiceItems,
    SupplierId: SupplierId,
    orgid,
  };

  if (InvoiceItems.length > 0 && InvoiceId && InvoiceId.length > 1) {
    const res = await UpdatePurchaseInvoice(data);
    if (res.status === "ok") {
      Invoice.ClearData();
      redirect(`/${orgid}/purchases_invocies/showInvoice?num=${res.data?.number}`);
      toast.success(t("success.updated"));
    } else {
      toast.error(res.message);
      setloading(false);
    }
  } else {
    toast.error(t("errors.failedUpdate"));
    setloading(false);
  }
};
