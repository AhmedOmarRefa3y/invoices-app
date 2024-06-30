import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./columns";

const ShowInvoices = async ({ params }: { params: { orgid: string } }) => {
    const SalesData = await GetSalesInvoices(params.orgid);

    return (
        <div className="flex relative gap-2 max-h-screen h-full  px-2 max-w-full">
            <div className="flex-1 p-2 mt-5 max-w-full">
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
            <div className="xl:basis-[25%] lg:flex hidden  h-full ">
                <SalesOverView SalesData={SalesData} />
            </div>
        </div>
    );
};

export default ShowInvoices;
