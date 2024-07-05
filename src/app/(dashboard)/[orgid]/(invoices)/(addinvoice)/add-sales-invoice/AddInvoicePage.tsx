"use client";

import * as React from "react";

import useInvoice from "@/lib/zustand/invoiceStore";

import { CustomerT } from "@/lib/types";
import InvoiceAction from "../components/InvoiceAction";
import InvoiceTable from "../components/InvoiceTable";
import Mode from "../components/Mode";
import SetCustomerAndDate from "../components/SetCustomerAndDate";
import CustomerBalance from "../components/customerBalance";

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
    const Invoice = useInvoice();
    const { customerId, setProducts } = Invoice;
    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId
    );

    React.useEffect(() => {
        setmounted(true);
        setProducts(products);
    }, [products, setProducts]);
    if (!mounted) {
        return null;
    }
    return (
        <div className="flex flex-col p-2 sm:w-[900px] max-w-full mx-auto gap-2">
            <div className="flex">
                <SetCustomerAndDate customers={customersBalannces} />
                <div className="hidden sm:flex">
                    <Mode />
                </div>
            </div>
            <div className="w-full border sm:border-none border-slate-900 overflow-x-auto mx-auto">
                <div className="min-w-[500px] p-2">
                    <InvoiceTable />
                </div>
            </div>
            <div className="flex flex-col  sm:flex-row justify-between w-full mt-2 ml-10 mr-auto ">
                <CustomerBalance
                    customerBalance={customer ? customer.Currbalance : 0}
                />
                <InvoiceAction />
            </div>
        </div>
    );
};

export default AddInvoicePage;
