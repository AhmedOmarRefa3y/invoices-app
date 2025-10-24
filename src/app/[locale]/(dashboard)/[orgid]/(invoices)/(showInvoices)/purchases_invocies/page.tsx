import { Suspense } from "react";
import { TableUi } from "@/components/table";
import { GetPurchasesInvoices } from "./PurchasesInvoices-utils";
import { PurchasesCloumns } from "./PurchasesCloumns";
import { getTranslations } from "next-intl/server";
import Loading from "@/app/[locale]/(dashboard)/[orgid]/loading";

const PurchasesInvoicesContent = async ({ orgid }: { orgid: string }) => {
  const t = await getTranslations("PurchasesCloumns");
  const PurchasesData = await GetPurchasesInvoices(orgid);

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
    <TableUi
      columns={PurchasesCloumns}
      data={PurchasesData}
      filterAccessorKey="SupplierName"
      filterlabel={t("supplierName")}
      filterplaceholder={t("searchByName")}
      notfound={t("noInvoicesFound")}
      reversedNavButton={true}
      csvData={csvData}
      csvFileName="purchasesInvoices"
    />
  );
};

const PurchasesInvoices = async ({ params }: { params: { orgid: string; locale: string } }) => {
  return (
    <div className="flex relative gap-2 max-h-screen h-full  px-2 max-w-full">
      <div className="w-fit mx-auto">
        <Suspense fallback={<Loading />}>
          <PurchasesInvoicesContent orgid={params.orgid} />
        </Suspense>
      </div>
    </div>
  );
};

export default PurchasesInvoices;
