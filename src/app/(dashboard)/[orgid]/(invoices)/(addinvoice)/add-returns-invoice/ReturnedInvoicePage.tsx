"use client";

import * as React from "react";

import InvoiceAction from "../components/InvoiceAction";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import SetCustomerAndDate from "../components/SetCustomerAndDate";
import { CustomerT } from "@/lib/types";
import useInvoice from "@/lib/zustand/invoiceStore";
import useGlobal from "@/lib/zustand/GlobalStore";

interface InvoiceProps {
    customers: Omit<
        CustomerT,
        "Payment" | "Orders" | "organization" | "_count"
    >[];
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

const ReturnedInvoicePage: React.FC<InvoiceProps> = ({
    customers,
    products,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const GlobalStore = useGlobal();
    const { setProducts } = GlobalStore;
    React.useEffect(() => {
        setmounted(true);
        setProducts(products);
    }, [products, setProducts]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="basis-[100%] p-2 sm:w-[900px] mx-auto">
            <div className="flex items-center justify-between w-full">
                <SetCustomerAndDate customers={customers} />
                <Mode />
            </div>
            <InvoiceTable />
            <div className="flex items-start justify-end gap-2 mt-2 mr-auto ">
                <InvoiceAction />
            </div>
        </div>
    );
};

export default ReturnedInvoicePage;
