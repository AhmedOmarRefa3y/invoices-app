import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./tableComponents/columns";

const ShowInvoices = async () => {
    const SalesData = await GetSalesInvoices();
    return (
        <div className="flex relative gap-2 overflow-x-clip ">
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
            <div className="xl:basis-[25%]">
                <SalesOverView SalesData={SalesData} />
            </div>
        </div>
    );
};

export default ShowInvoices;
