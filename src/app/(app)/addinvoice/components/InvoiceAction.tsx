import { Button } from "@/components/ui/button";
import React from "react";
import { SaveSalesInvoice, UpadteSalesInvoice } from "../sales/sales-utils";
import useInvoice from "@/lib/zustand";
import { usePathname, useRouter } from "next/navigation";
import { saveREtInvoiceToDB } from "../sales-returns/sales-returns-utils";

const InvoiceAction = () => {
    const router = useRouter();
    const Invoice = useInvoice();
    const { clearData, InvoiceId } = Invoice;
    const [loading, setloading] = React.useState(false);
    const pathName = usePathname();
    const redirect = (url: any) => {
        router.push(url);
    };

    const saveREtInvoiceTo = async () => {
        await saveREtInvoiceToDB(Invoice, setloading, redirect);
    };
    const NewInvoice = async () => {
        await SaveSalesInvoice(Invoice, setloading, redirect);
    };

    const UpadteInvoice = async () => {
        await UpadteSalesInvoice(Invoice, setloading, redirect);
    };

    const SaveInvoice = async () => {
        if (pathName === "/addinvoice/sales") {
            InvoiceId ? UpadteInvoice() : NewInvoice();
        }
        if (pathName === "/addinvoice/sales-returns") {
            saveREtInvoiceTo();
        }
    };
    return (
        <div className="flex items-start justify-center gap-2 ">
            <Button
                type="button"
                onClick={SaveInvoice}
                className="w-full text-lg md:w-fit "
                disabled={
                    !Invoice.customerId || Invoice.items.length < 1 || loading
                        ? true
                        : false
                }
            >
                {InvoiceId ? "تعديل الفاتورة" : "حفظ الفاتورة"}
            </Button>
            <Button className="col-span-2 mr-auto w-fit" onClick={clearData}>
                إلغاء
            </Button>
        </div>
    );
};

export default InvoiceAction;
