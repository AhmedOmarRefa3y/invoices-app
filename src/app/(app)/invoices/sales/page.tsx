import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import { columns } from "./tableComponents/columns";

const ShowInvoices = async () => {
    const SalesData = await GetSalesInvoices();
    return (
        <div className="flex border-gray-200  bg-opacity-50 relative max-h-screen p-2">
            <div className="basis-[80%]">
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
            <div className="basis-[20%] border bg-gray-100 w-full  min-h-full p-2 flex flex-col gap-2">
                <div className="flex  items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
                    <div className="">اجمالي مبيعات السنة </div>
                    <div className="text-pink-700 font-semibold">
                        {SalesData.currentYearSales}
                    </div>
                </div>
                <div className="flex  items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
                    <div className="">اجمالي مبيعات الشهر </div>
                    <div className="text-pink-700 font-semibold">
                        {SalesData.currentMonthSales}
                    </div>
                </div>
                <div className="h-[60%] overflow-y-scroll">
                    {SalesData.customersSales.map((customer) => (
                        <div className="flex  items-center justify-between gap-2 bg-[#fafafa] border border-stone-300 py-1 px-2">
                            <div className="">{customer.customerName}</div>
                            <div className="text-pink-700 font-semibold">
                                {customer.totalSales}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowInvoices;
