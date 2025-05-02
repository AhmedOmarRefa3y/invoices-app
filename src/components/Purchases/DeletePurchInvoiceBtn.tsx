"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DeletePurchaseInvoice } from "@/actions/purchInvoice";
import { useTranslations } from "next-intl";
interface DeleteInvoiceBtnProps {
  id: string;
  className?: string;
}

const DeletePurchInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({ id, className }) => {
  const [open, setOpen] = useState(false);
  const tCommon = useTranslations("common");

  const deleteInvoice = async () => {
    try {
      const res = await DeletePurchaseInvoice(id);

      if (res.status === "ok") {
        toast.success("Invoice successfully deleted");
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete the invoice");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex-1  text-center bg-red-500 h-10 px-4 py-2 rounded text-white hover:bg-red-500/90">
        {tCommon("delete")}
      </DialogTrigger>
      <DialogContent className="z-[100]   p-10  max-w-fit border border-stone-300">
        <DialogHeader dir="rtl" className="flex items-center ">
          <DialogTitle dir="ltr">Are you sure?</DialogTitle>
          <DialogDescription className="w-full flex gap-2">
            <Button
              onClick={deleteInvoice}
              className={cn(" max-w-fit", className)}
              variant={"destructive"}
            >
              {tCommon("yes")}
            </Button>
            <Button onClick={() => setOpen(false)} className={cn(" w-fit bg-slate-400")}>
              {tCommon("no")}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePurchInvoiceBtn;
