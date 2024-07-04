"use client";

import * as React from "react";

import { CustomerT } from "@/lib/types";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import { Product } from "@prisma/client";
import SetCustomerAndDate from "./purchase-components/SetCustomerAndDate";
import InvoiceTable from "./purchase-components/InvoiceTable";
import CustomerBalance from "./purchase-components/customerBalance";
import InvoiceAction from "./purchase-components/InvoiceAction";

interface SuppliersWithBalancesT {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    IsASupplier: boolean;
    CustomerCredit: number;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    TotalPayments: number;
    InvoiceTotal: number;
    REtInvTotal: number;
    PurchaseTotal: number;
    openCredit: number;
    Currbalance: number;
}

interface InvoiceProps {
    SuppliersBalannces: SuppliersWithBalancesT[];
    products: Product[];
}

const AddPurchaseInvoice: React.FC<InvoiceProps> = ({
    SuppliersBalannces,
    products,
}) => {
    const [mounted, setmounted] = React.useState(false);
    const PurchaseInvoiceState = usePurchaseInvoice();
    const { SupplierId, setProducts } = PurchaseInvoiceState;
    const Supplier = SuppliersBalannces.find(
        (SupplierInfo) => SupplierInfo.id === SupplierId
    );

    console.log(PurchaseInvoiceState);

    React.useEffect(() => {
        setmounted(true);
        setProducts(products);
    }, []);
    if (!mounted) {
        return null;
    }

    return (
        <div className="flex flex-col p-2 sm:max-w-[900px] max-w-full mx-auto gap-2">
            <div className="flex">
                <SetCustomerAndDate Suppliers={SuppliersBalannces} />
                <div className="hidden sm:flex">{/* <Mode /> */}</div>
            </div>
            <div className="w-full border sm:border-none border-slate-900 overflow-x-auto mx-auto">
                <div className="min-w-[500px] p-2">
                    <InvoiceTable />
                </div>
            </div>
            <div className="flex flex-col  sm:flex-row justify-between w-full mt-2 ml-10 mr-auto ">
                <CustomerBalance
                    customerBalance={Supplier ? Supplier.Currbalance : 0}
                />
                <InvoiceAction />
            </div>
        </div>
    );
};

export default AddPurchaseInvoice;
