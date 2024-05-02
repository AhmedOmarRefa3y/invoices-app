import ProductionPage from "./ProductionPage";

import { Part } from "@prisma/client";
import prismaDb from "@/lib/prisma";
import { endOfYear, startOfYear } from "date-fns";
import { getAvailableProducts } from "../../../inventory/inventory-utils";

const Page = async ({ params }: { params: { orgid: string } }) => {
    const InventoryItems = await getAvailableProducts(params.orgid);
    const ProductionPlans = await prismaDb.productionPlan.findMany({
        where: {
            producedAt: {
                gte: startOfYear(new Date()),
                lte: endOfYear(new Date()),
            },
            organizationId: params.orgid,
        },
        include: {
            lineItems: {
                include: {
                    product: {
                        include: {
                            unit: true,
                        },
                    },
                },
            },
            ProductionEvents: {
                include: {
                    lineItems: {
                        include: {
                            product: {
                                include: {
                                    unit: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const formattedProducts: {
        id: string;
        name: string;
        isAComposistion: boolean | undefined;
        avaliableQuantity: number;
        unit: string;
        parts?: Part[];
    }[] = InventoryItems.map((item) => {
        return {
            avaliableQuantity: item.availableQuantity,
            id: item.id,
            name: item.productName,
            isAComposistion: item.isAcomposistion,
            unit: item.unit,
            parts: item.parts,
        };
    });

    return (
        <ProductionPage
            products={formattedProducts}
            productionPlans={ProductionPlans}
        />
    );
};

export default Page;
