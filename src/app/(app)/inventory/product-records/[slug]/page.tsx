import RecordsTable from "./table";
import { getInventoryRecords } from "./utils";

export default async function Page({ params }: { params: { slug: string } }) {
    const { allRecords, product } = await getInventoryRecords(params.slug);

    return (
        <div className="p-2 mx-auto w-full">
            
            <div className="mx-auto ">
                <RecordsTable
                    records={allRecords}
                    productInfo={{
                        name: product?.name,
                    }}
                />
            </div>
        </div>
    );
}
