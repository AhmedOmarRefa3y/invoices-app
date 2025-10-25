import { TableUi } from "@/components/table";
import { GetPurchasesInvoices } from "./PurchasesInvoices-utils";
import { PurchasesCloumns } from "./PurchasesCloumns";
import { getTranslations } from "next-intl/server";

const PurchasesInvoices = async ({
  params,
}: {
  params: Promise<{ orgid: string; locale: string }>;
}) => {
  const t = await getTranslations("PurchasesCloumns");
  const PurchasesData = await GetPurchasesInvoices((await params).orgid);

  const csvData = PurchasesData.map((item) => {
    return {
      invoiceNumber: item.number,
      SupplierName: item.SupplierName,
      date: item.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      TotalAmount: item.amount,
      CreatedAt: item.CreatedAt,
    };
  });
  return (
    <div className="flex relative gap-2 max-h-screen h-full  px-2 max-w-full">
      <div className="w-fit mx-auto">
        <TableUi
          columns={PurchasesCloumns}
          data={PurchasesData}
          filterAccessorKey="SupplierName"
          filterlabel={t("supplierName")}
          filterplaceholder={t("searchByName")}
          notfound={t("noInvoicesFound")}
          reversedNavButton={true}
          csvData={csvData}
          csvFileName={"purchasesInvoices"}
        />
      </div>
    </div>
  );
};

export default PurchasesInvoices;
