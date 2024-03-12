"use client";
import { Toaster } from "react-hot-toast";

import { ChakraProvider } from "@chakra-ui/react";
import AddNewProductModal from "@/components/modals/addProductModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>
            <ChakraProvider>
                <AddNewProductModal
                    products={products}
                    categories={categories}
                    units={units}
                />
                <AddNewCustomerModalNEW />
                <AddNewPaymentModal customers={customers} />
                <Toaster />
                {children}
            </ChakraProvider>
        </SessionProvider>
    );
}
