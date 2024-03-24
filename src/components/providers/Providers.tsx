"use client";

import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import AddNewProductModal from "@/components/modals/addProductModal";
import { CategoriesT, CustomerT, ProductT, UnitT } from "@/lib/types";
import { AddNewUnitModal } from "../modals/addUnitModal";
import { AddNewCategoryModal } from "../modals/addInventoryModal";

export function Providers({
    children,
    products,
    categories,
    units,
    customers,
}: {
    children: React.ReactNode;
    products: Pick<ProductT, "id" | "name" | "Part" | "isAcomopsition">[];
    categories: Pick<CategoriesT, "id" | "name" | "organizationId">[];
    units: Pick<UnitT, "id" | "name" | "organizationId">[];
    customers: Pick<CustomerT, "id" | "name">[];
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
            <AddNewUnitModal />
            <AddNewCategoryModal />
            {children}
        </>
    );
}
