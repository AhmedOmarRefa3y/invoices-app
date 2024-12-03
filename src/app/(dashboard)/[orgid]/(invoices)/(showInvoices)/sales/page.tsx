import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./columns";
import { CSVDownload, CSVLink } from "react-csv";

const ShowInvoices = async ({ params }: { params: { orgid: string } }) => {
    const SalesData = await GetSalesInvoices(params.orgid);

    const csvData = SalesData.FormatedInvoices.map((item) => {
        return {
            invoiceNumber: item.number,
            customerName: item.customerName,
            date: item.date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            TotalAmount: item.amount,
            Paid: item.PaidAmount,
            CreatedAt: item.CreatedAt,
        };
    });
    return (
        <div className="flex relative gap-2 max-h-screen h-full  px-2 max-w-full">
            <div className="flex-1 p-2 mt-5 max-w-full">
                <TableUi
                    columns={columns}
                    data={SalesData.FormatedInvoices}
                    filterAccessorKey="customerName"
                    filterlabel="Customer Name"
                    filterplaceholder="Search by Customer Name"
                    notfound="No invoices found"
                    reversedNavButton={true}
                    csvData={csvData}
                    csvFileName="Invoices"
                />
            </div>
            <div className="xl:basis-[25%] xl:flex hidden  h-full ">
                <SalesOverView SalesData={SalesData} />
            </div>
        </div>
    );
};

export default ShowInvoices;
