import { TableUi } from "@/components/table";
import { GetSalesInvoices } from "./sales-utils";

import SalesOverView from "./Sales";
import { columns } from "./columns";
import { getTranslations } from "next-intl/server";

const ShowInvoices = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const SalesData = await GetSalesInvoices((await params).orgid);

  const t = await getTranslations("salesInvoiceTable");

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
          filterlabel={t("customerName")}
          filterplaceholder={t("searchByName")}
          notfound={t("noInvoicesFound")}
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
