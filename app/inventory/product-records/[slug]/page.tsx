import prismaDb from "@/lib/prisma";
import { inventoryRecords } from "./product-table/columns";
import { DataTable } from "./product-table/data-table";
import RecordsTable from "./table";

interface record {
    date: Date | undefined;
    type: "out" | "in";
    recordName: string;
    quantity: number;
}
export default async function Page({ params }: { params: { slug: string } }) {
    const product = await prismaDb.product.findFirst({
        where: { id: params.slug },
        include: {
            InventoryRecord: {
                where: {
                    year: 2024,
                },
            },
        },
    });
    const getInventoryRecords = async () => {
        const allRecords: record[] = [];

        const invoices = await prismaDb.lineItem.findMany({
            where: { productId: params.slug },
            include: {
                invoice: true,
                ReturnedInvoice: true,
            },
        });

        const productions = await prismaDb.productionEvent.findMany({
            where: { productId: params.slug },
        });
        invoices.map((item) => {
            if (item.invoiceId) {
                allRecords.push({
                    date: item.invoice?.date,
                    quantity: item.quantity,
                    type: "out",
                    recordName: "sales",
                });
            } else {
                allRecords.push({
                    date: item.ReturnedInvoice?.date,
                    quantity: item.quantity,
                    type: "in",
                    recordName: "ret",
                });
            }
        });
        productions.map((item) => {
            allRecords.push({
                date: item.producedAt,
                quantity: item.quantity,
                type: "in",
                recordName: "prod",
            });
        });
        allRecords.sort((a, b) => {
            const dateA = a.date?.getTime() || 0;
            const dateB = b.date?.getTime() || 0;

            return dateA - dateB;
        });
        return allRecords;
    };
    const InventoryItems = await getInventoryRecords();
    console.log(InventoryItems);
    return (
        <div>
            {/* <DataTable columns={inventoryRecords} data={InventoryItems} /> */}
            <RecordsTable
                records={InventoryItems}
                productInfo={{
                    initialQuantitiy:
                        product?.InventoryRecord[0].openingQuantity,
                    name: product?.name,
                }}
            />
        </div>
    );
}
