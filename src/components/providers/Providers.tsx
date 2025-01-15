"use client";

import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import AddNewProductModal from "@/components/modals/addProductModal";
import { CategoriesT, CustomerT, ProductT, UnitT } from "@/lib/types";
import { AddNewUnitModal } from "../modals/addUnitModal";
import { AddNewCategoryModal } from "../modals/addInventoryModal";
interface extendedProductT extends ProductT {
    parts?:
        | {
              productid: string;
              quantity: number;
              name: string;
          }[]
        | undefined;
}
export default function Providers({
    products,
    categories,
    units,
    customers,
}: {
    products: extendedProductT[];
    categories: Pick<CategoriesT, "id" | "name" | "organizationId">[];
    units: Pick<UnitT, "id" | "name" | "organizationId">[];
    customers: Pick<CustomerT, "id" | "name">[];
}) {
    return <div className=""></div>;
}
