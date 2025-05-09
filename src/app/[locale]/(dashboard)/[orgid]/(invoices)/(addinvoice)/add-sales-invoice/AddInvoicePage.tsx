"use client";

import * as React from "react";

import { CustomerT } from "@/lib/types";
import AddInvoiceComponent from "@/components/Invoice/invoice";
import useGlobal from "@/lib/zustand/GlobalStore";

interface CustomersWithBalancesT
  extends Omit<CustomerT, "Payment" | "Orders" | "organization" | "_count"> {
  TotalPayments: number;
  InvoiceTotal: number;
  REtInvTotal: number;
  Currbalance: number;
}

interface InvoiceProps {
  customersBalannces: CustomersWithBalancesT[];
  products: {
    id: string;
    name: string;
    price: number;
    Part: {
      product: {
        name: string;
        price: number;
      };
      name: string;
      partProductId: string;
      quantity: number;
    }[];
    isAcomopsition: boolean;
    catgoryId: string;
    unitId: string;
    initialquantity: number;
  }[];
}

const AddInvoicePage: React.FC<InvoiceProps> = ({ customersBalannces, products }) => {
  const [mounted, setmounted] = React.useState(false);
  const { setProducts } = useGlobal();

  React.useEffect(() => {
    setmounted(true);
    setProducts(products);
  }, [products, setProducts]);
  if (!mounted) {
    return null;
  }
  return <AddInvoiceComponent customersBalannces={customersBalannces} type="sales" />;
};

export default AddInvoicePage;
