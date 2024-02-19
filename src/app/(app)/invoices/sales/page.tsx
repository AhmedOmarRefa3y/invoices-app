import { GetSalesInvoices } from "./sales-utils";
import { columns } from "./tableComponents/columns";
import { DataTable } from "./tableComponents/data-table";
import InvTable from "./tableComponents/table";

const ShowInvoices = async () => {
    const Invoices = await GetSalesInvoices();
    return (
        <div className=" border-gray-200    bg-opacity-50 relative">
            {/* <DataTable columns={columns} data={Invoices} /> */}
            <InvTable />
        </div>
    );
};

export default ShowInvoices;
