"use client";
import { DeleteInvoice } from "@/actions/invoice";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
interface DeleteInvoiceBtnProps {
    id: string;
    className?: string;
}

const DeleteInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({
    id,
    className,
}) => {
    const [open, setOpen] = useState(false);

    const deleteInvoice = async () => {
        try {
            const res = await DeleteInvoice(id);

            if (res.status === "ok") {
                toast.success("تم حذف الفاتورة بنجاح");
                setOpen(false);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("لم يتم حذف الفاتورة");
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="flex-1  text-center bg-red-500 h-10 px-4 py-2 rounded text-white hover:bg-red-500/90">
                حذف الفاتورة
            </DialogTrigger>
            <DialogContent>
                <DialogHeader dir="rtl" className="flex items-center ">
                    <DialogTitle dir="ltr">هل انت متاكد ؟</DialogTitle>
                    <DialogDescription className="w-full flex gap-2">
                        <Button
                            onClick={deleteInvoice}
                            className={cn("w-full", className)}
                            variant={"destructive"}
                        >
                            حذف
                        </Button>
                        <Button
                            onClick={() => setOpen(false)}
                            className={cn("w-full bg-slate-400")}
                        >
                            اغلاق
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteInvoiceBtn;
