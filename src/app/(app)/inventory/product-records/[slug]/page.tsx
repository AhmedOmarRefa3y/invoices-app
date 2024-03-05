import RecordsTable from "./table";
import { getInventoryRecords } from "./utils";

export default async function Page({ params }: { params: { slug: string } }) {
    const { allRecords, product } = await getInventoryRecords(params.slug);
    // console.log(product);

    return (
        <div>
            <RecordsTable
                records={allRecords}
                productInfo={{
                    name: product?.name,
                }}
            />
        </div>
    );
}
