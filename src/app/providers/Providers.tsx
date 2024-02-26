"use client";
import { Toaster } from "react-hot-toast";

import { ChakraProvider } from "@chakra-ui/react";
import AddNewProductModal from "@/components/modals/addProductModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";

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
        <ChakraProvider>
            <AddNewProductModal
                products={products}
                categories={categories}
                units={units}
            />
            <AddNewPaymentModal customers={customers} />
            <Toaster />
            {children}
        </ChakraProvider>
    );
}
