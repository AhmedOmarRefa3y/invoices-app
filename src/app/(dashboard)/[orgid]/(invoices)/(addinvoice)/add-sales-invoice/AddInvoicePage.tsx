"use client";

import * as React from "react";

import useInvoice from "@/lib/zustand/invoiceStore";

import { CustomerT } from "@/lib/types";
import AddInvoiceComponent from "@/components/Invoice/invoice";
import useGlobal from "@/lib/zustand/GlobalStore";
import { SaveSalesInvoice, UpadteSalesInvoice } from "./sales-utils";

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
        Part:
            | {
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
    }[];
}

const AddInvoicePage: React.FC<InvoiceProps> = ({
    customersBalannces,
    products,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const { setProducts } = useGlobal();
    const InvoiceStore = useInvoice();

    React.useEffect(() => {
        setmounted(true);
        setProducts(products);
    }, [products, setProducts]);
    if (!mounted) {
        return null;
    }
    return (
        <AddInvoiceComponent
            addRow={InvoiceStore.addRow}
            customerId={InvoiceStore.customerId}
            customersBalannces={customersBalannces}
            items={InvoiceStore.items}
            products={products}
            setCustomerId={InvoiceStore.setCustomerId}
            type="sales"
            updateItem={InvoiceStore.updateItem}
            InvoiceData={{
                customerId: InvoiceStore.customerId,
                date: InvoiceStore.date,
                invoiceAmount: InvoiceStore.invoiceAmount,
                Items: InvoiceStore.items,
                invoiceId: InvoiceStore.InvoiceId,
            }}
            clearData={InvoiceStore.clearData}
            saveInvoice={SaveSalesInvoice}
            updateInvoice={UpadteSalesInvoice}
        />
    );
};

export default AddInvoicePage;
