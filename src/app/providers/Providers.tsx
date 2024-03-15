"use client";
import { Toaster } from "react-hot-toast";

import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import AddNewProductModal from "@/components/modals/addProductModal";

export function Providers({
    children,
    products,
    categories,
    units,
    customers,
}: {
    children: React.ReactNode;
    products: any;
    categories: any;
    units: any;
    customers: any;
}) {
    return (
        <>
            <AddNewProductModal
                products={products}
                categories={categories}
                units={units}
            />
            <AddNewCustomerModalNEW />
            <AddNewPaymentModal customers={customers} />
            <Toaster />
            {children}
        </>
    );
}
