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

const DeleteInvoiceBtn: React.FC<DeleteInvoiceBtnProps> = ({ id, className }) => {
  const [open, setOpen] = useState(false);

  const deleteInvoice = async () => {
    try {
      const res = await DeleteInvoice(id);

      if (res.status === "ok") {
        toast.success("Invoice successfully deleted");
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to delete the invoice");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex-1  text-center bg-red-500 h-10 px-4 py-2 rounded text-white hover:bg-red-500/90">
        Delete Invoice
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
              Yes
            </Button>
            <Button onClick={() => setOpen(false)} className={cn(" w-fit bg-slate-400")}>
              Close
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoiceBtn;
