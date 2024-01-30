import { GetSalesInvoices } from "./sales-utils";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";

const ShowInvoices = async () => {
    const Invoices = await GetSalesInvoices();
    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            <DataTable columns={columns} data={Invoices} />
        </div>
    );
};

export default ShowInvoices;
