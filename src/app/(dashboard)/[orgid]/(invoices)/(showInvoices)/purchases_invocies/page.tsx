import { TableUi } from "@/components/table";
import { GetPurchasesInvoices } from "./PurchasesInvoices-utils";
import { PurchasesCloumns } from "./PurchasesCloumns";

const PurchasesInvoices = async ({ params }: { params: { orgid: string } }) => {
    const PurchasesData = await GetPurchasesInvoices(params.orgid);

    const csvData = PurchasesData.map((item) => {
        return {
            invoiceNumber: item.number,
            SupplierName: item.SupplierName,
            date: item.date.toLocaleDateString("ar-EG", {
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
                    filterlabel="اسم المورد"
                    filterplaceholder="ابحث عن المورد بالاسم"
                    notfound="لا يوجد فواتير متاحة"
                    reversedNavButton={true}
                    csvData={csvData}
                    csvFileName="PurchasesInvoices"
                />
            </div>
        </div>
    );
};

export default PurchasesInvoices;
