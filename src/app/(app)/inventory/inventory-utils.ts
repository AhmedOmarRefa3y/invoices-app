import prismaDb from "@/lib/prisma";
import { inventoryT } from "./tableComponents/columns";

export async function getAvailableProducts() {
    const currentYear = new Date().getFullYear();
    const lastDayOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
    const availableProducts = await prismaDb.product.findMany({
        where: {
            isAcomopsition: false,
        },
        include: {
            LineItem: {
                include: {
                    invoice: true,
                    ReturnedInvoice: true,
                    ProductionEvent: true,
                    product: true,
                },
            },
            Part: true,
            unit: true,
        },
    });

    // console.log(availableProducts);

    const productsWithAvailability: inventoryT[] = availableProducts.map(
        (product) => {
            let sold = 0;
            let reuturned = 0;
            let produced = 0;
            let outProduction = 0;

            product.LineItem.map((LineItem) => {
                // console.log(LineItem);
                if (LineItem.invoice) {
                    sold += LineItem.quantity;
                }
                if (LineItem.ReturnedInvoice) {
                    reuturned += LineItem.quantity;
                }
                if (LineItem.isProduction) {
                    produced += LineItem.quantity;
                }
                if (LineItem.isReduction) {
                    outProduction += LineItem.quantity;
                }
            });
            return {
                id: product.id,
                productName: product.name,
                isAcomposistion: product.isAcomopsition,
                initalQuantity: 0,
                producedQuantity: produced,
                returnedQuantity: reuturned,
                soldQuantity: sold,
                outProduction: outProduction,
                availableQuantity:
                    0 + produced + reuturned - sold - outProduction,
                parts: product.Part,
                unit: product.unit?.name as string,
            };
        }
    );
    productsWithAvailability.sort((a, b) =>
        a.productName.localeCompare(b.productName)
    );

    return productsWithAvailability;
}
