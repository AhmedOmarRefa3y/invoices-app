"use client";
import { CategoriesT, CustomerT, ProductT, UnitT } from "@/lib/types";
import dynamic from "next/dynamic";
interface extendedProductT extends ProductT {
    parts?:
        | {
              productid: string;
              quantity: number;
              name: string;
          }[]
        | undefined;
}

const DynamicCustomerModal = dynamic(
    () => import("@/components/modals/addCustomerModal"),
    {
        ssr: false,
    }
);
const DynamicPaymentModal = dynamic(
    () => import("@/components/modals/addNewPaymentModal"),
    {
        ssr: false,
    }
);
const DynamicProductModal = dynamic(
    () => import("@/components/modals/addProductModal"),
    {
        ssr: false,
    }
);
const DynamicCategoryModal = dynamic(
    () => import("../modals/addInventoryModal"),
    {
        ssr: false,
    }
);
const DynamicUnitModal = dynamic(() => import("../modals/addUnitModal"), {
    ssr: false,
});
export function Providers({
    children,
    products,
    categories,
    units,
    customers,
}: {
    children: React.ReactNode;
    products: extendedProductT[];
    categories: Pick<CategoriesT, "id" | "name" | "organizationId">[];
    units: Pick<UnitT, "id" | "name" | "organizationId">[];
    customers: Pick<CustomerT, "id" | "name">[];
}) {
    return (
        <>
            <DynamicProductModal
                products={products}
                categories={categories}
                units={units}
            />
            <DynamicCustomerModal />
            <DynamicPaymentModal customers={customers} />
            <DynamicUnitModal />
            <DynamicCategoryModal />
            {children}
        </>
    );
}
