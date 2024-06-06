import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./columns";

const ShowInvoices = async ({ params }: { params: { orgid: string } }) => {
    const SalesData = await GetSalesInvoices(params.orgid);

    return (
        <div className="flex relative gap-2 max-h-screen h-full overflow-x-clip px-2">
            <div className="basis-[100%] max-w-[100%] xl:basis-[75%] p-2 mt-5 ">
                <TableUi
                    columns={columns}
                    data={SalesData.FormatedInvoices}
                    filterAccessorKey="customerName"
                    filterlabel="اسم العميل"
                    filterplaceholder="ابحث عن العميل بالاسم"
                    notfound="لا يوجد فواتير متاحة"
                    reversedNavButton={true}
                />
            </div>
            <div className="xl:basis-[25%] sm:flex  h-full ">
                <SalesOverView SalesData={SalesData} />
            </div>
        </div>
    );
};

export default ShowInvoices;
