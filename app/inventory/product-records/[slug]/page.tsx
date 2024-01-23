import RecordsTable from "./table";
import { getInventoryRecords } from "./utils";

export default async function Page({ params }: { params: { slug: string } }) {
    const { allRecords, product } = await getInventoryRecords(params.slug);

    return (
        <div>
            <RecordsTable
                records={allRecords}
                productInfo={{
                    initialQuantitiy:
                        product?.InventoryRecord[0].openingQuantity,
                    name: product?.name,
                }}
            />
        </div>
    );
}
