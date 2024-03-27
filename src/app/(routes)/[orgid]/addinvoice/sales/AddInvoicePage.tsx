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
    const { customerId } = Invoice;
    const customer = customersBalannces.find(
        (customerInfo) => customerInfo.id === customerId
    );

    React.useEffect(() => {
        setmounted(true);
        Invoice.setProducts(products);
    }, []);
    if (!mounted) {
        return null;
    }
    return (
        <div className="flex relative gap-2  overflow-x-clip mx-auto">
            <div className="basis-[100%] p-2 max-w-[900px] mx-auto">
                <div className="flex items-center justify-between w-full">
                    <SetCustomerAndDate customers={customersBalannces} />
                    <Mode />
                </div>
                <InvoiceTable />
                <div className="flex justify-between w-full mt-2 ml-10 mr-auto ">
                    <CustomerBalance
                        customerBalance={customer ? customer.Currbalance : 0}
                    />
                    <InvoiceAction />
                </div>
            </div>
            {/* <div>
                <Prices />
            </div> */}
        </div>
    );
};

export default AddInvoicePage;
