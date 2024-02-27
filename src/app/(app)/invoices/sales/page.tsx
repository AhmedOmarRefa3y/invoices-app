import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import InvoiceActions from "./tableComponents/InvoiceActions";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowInvoices = async () => {
    const Invoices = await GetSalesInvoices();
    return (
        <div className="flex border-gray-200  bg-opacity-50 relative max-h-screen ">
            <div className="basis-[80%]">
                <TableUi
                    columns={columns}
                    data={Invoices}
                    filterAccessorKey="customerName"
                    filterlabel="اسم العميل"
                    filterplaceholder="ابحث عن العميل بالاسم"
                    notfound="لا يوجد فواتير متاحة"
                />
            </div>
            <div className="basis-[20%] border bg-gray-100 w-full h-full"></div>
        </div>
    );
};

export default ShowInvoices;
