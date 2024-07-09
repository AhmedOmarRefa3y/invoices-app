import { Button } from "@/components/ui/button";
import React from "react";

import { useParams, usePathname, useRouter } from "next/navigation";
import useInvoice from "@/lib/zustand/invoiceStore";
import { saveREtInvoiceToDB } from "@/app/(dashboard)/[orgid]/(invoices)/(addinvoice)/add-returns-invoice/sales-returns-utils";
import {
    InvoiceData,
    SaveSalesInvoice,
    UpadteSalesInvoice,
} from "@/app/(dashboard)/[orgid]/(invoices)/(addinvoice)/add-sales-invoice/sales-utils";

interface InvoiceProps {
    type: "sales" | "returns" | "purchases";
    saveNewInvoice: (
        Invoice: InvoiceData,
        setloading: (sate: boolean) => void,
        redirect: (num: number | string) => void,
        orgid: string
    ) => void;
    UpadteInvoice: (
        Invoice: InvoiceData,
        setloading: (sate: boolean) => void,
        redirect: (num: number | string) => void,
        orgid: string
    ) => void;
    InvoiceData: InvoiceData;
    clearData: () => void;
}
const InvoiceAction: React.FC<InvoiceProps> = ({
    InvoiceData,
    UpadteInvoice,
    saveNewInvoice,
    type,
    clearData,
}) => {
    const router = useRouter();
    const [loading, setloading] = React.useState(false);
    const params: { orgid: string } = useParams();
    const redirect = (url: any) => {
        router.push(url);
    };

    const SaveInvoice = async () => {
        InvoiceData.invoiceId
            ? UpadteInvoice(InvoiceData, setloading, redirect, params.orgid)
            : saveNewInvoice(InvoiceData, setloading, redirect, params.orgid);
    };
    return (
        <div className="flex flex-col items-start justify-center gap-2 ">
            <Button
                variant={"default"}
                type="button"
                onClick={SaveInvoice}
                className="w-full text-lg md:w-fit bg-green-500 text-black font-bold hover:bg-green-600 "
                disabled={
                    !InvoiceData.customerId ||
                    InvoiceData.Items.length < 1 ||
                    loading
                        ? true
                        : false
                }
            >
                {InvoiceData.invoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
            </Button>
            <Button
                className="col-span-2 mr-auto w-full bg-red-500 hover:bg-red-600 text-lg text-black font-bold"
                onClick={clearData}
            >
                إلغاء
            </Button>
        </div>
    );
};

export default InvoiceAction;
