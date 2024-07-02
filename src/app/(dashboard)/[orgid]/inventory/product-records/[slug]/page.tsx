import RecordsTable from "./table";
import { getInventoryRecords } from "./utils";

export default async function Page({
    params,
}: {
    params: { slug: string; orgid: string };
}) {
    const { allRecords, product } = await getInventoryRecords(
        params.slug,
        params.orgid
    );

    return (
        <div className="p-2 mx-auto w-full max-w-full overflow-x-auto h-full">
            <div className="mx-auto max-w-full w-full">
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
