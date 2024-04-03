"use client";
import { DeleteCustomer } from "@/app/actions/customer";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "./button";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteCustomerProps {
    id: string;
}

const DeleteCustomerBtn: React.FC<DeleteCustomerProps> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const DeleteCustomerByID = async () => {
        const DeletedCustomer = await DeleteCustomer(id);
        if (DeletedCustomer) {
            toast.success("تم حذف العميل بنجاح");
            setOpen(false);
        } else {
            toast.error("لم يتم حذف العميل ");
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className=" bg-red-500 hover:bg-red-500/80 text-center w-full p-2 rounded-md">
                حذف العميل
            </DialogTrigger>
            <DialogContent>
                <DialogHeader dir="rtl" className="flex items-center ">
                    <DialogTitle dir="ltr">هل انت متاكد ؟</DialogTitle>
                    <DialogDescription className="w-full flex gap-2">
                        {/* This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers. */}
                        <Button
                            onClick={DeleteCustomerByID}
                            className={cn("w-full")}
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

export default DeleteCustomerBtn;
