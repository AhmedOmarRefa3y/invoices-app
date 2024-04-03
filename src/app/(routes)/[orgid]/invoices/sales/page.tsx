import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./tableComponents/columns";
import { auth } from "auth";

const ShowInvoices = async ({ params }: { params: { orgid: string } }) => {
    const SalesData = await GetSalesInvoices(params.orgid);
    const session = await auth();

    return (
        <div className="flex relative gap-2 overflow-x-clip max-h-screen h-full">
            <div className="basis-[100%] xl:basis-[75%] p-2">
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
            <div className="xl:basis-[25%] flex ">
                <SalesOverView SalesData={SalesData} />
            </div>
        </div>
    );
};

export default ShowInvoices;
