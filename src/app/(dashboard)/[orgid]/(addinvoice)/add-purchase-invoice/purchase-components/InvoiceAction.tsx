import { Button } from "@/components/ui/button";
import React from "react";

import { useParams, usePathname, useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand/invoiceStore";
import { SavePurchaseInvoice } from "../purchase-utils";
import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";

const InvoiceAction = () => {
    const router = useRouter();
    const Invoice = usePurchaseInvoice();
    const { ClearData, InvoiceId } = Invoice;
    const [loading, setloading] = React.useState(false);
    const params: { orgid: string } = useParams();
    const pathName = usePathname();
    const redirect = (url: any) => {
        router.push(url);
    };

    // const saveREtInvoiceTo = async () => {
    //     await saveREtInvoiceToDB(Invoice, setloading, redirect, params.orgid);
    // };
    const NewInvoice = async () => {
        await SavePurchaseInvoice(Invoice, setloading, redirect, params.orgid);
    };

    // const UpadteInvoice = async () => {
    //     await UpadteSalesInvoice(Invoice, setloading, redirect, params.orgid);
    // };

    const SaveInvoice = async () => {
        NewInvoice();
        // if (pathName === `/${params.orgid}/add-sales-invoice`) {
        //     InvoiceId ? UpadteInvoice() : NewInvoice();
        // }
        // if (pathName === `/${params.orgid}/add-returns-invoice`) {
        //     // saveREtInvoiceTo();
        // }
    };
    return (
        <div className="flex flex-col items-start justify-center gap-2 ">
            <Button
                variant={"default"}
                type="button"
                onClick={SaveInvoice}
                className="w-full text-lg md:w-fit bg-green-500 text-black font-bold hover:bg-green-600 "
                disabled={
                    !Invoice.SupplierId ||
                    Invoice.PurchaseInvoiceItems.length < 1 ||
                    loading
                        ? true
                        : false
                }
            >
                {InvoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
            </Button>
            <Button
                className="col-span-2 mr-auto w-full bg-red-500 hover:bg-red-600 text-lg text-black font-bold"
                onClick={ClearData}
            >
                إلغاء
            </Button>
        </div>
    );
};

export default InvoiceAction;
