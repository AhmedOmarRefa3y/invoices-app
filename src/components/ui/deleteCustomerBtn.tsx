"use client";
import { DeleteCustomer } from "@/actions/customers";
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
import { useTranslations } from "next-intl";

interface DeleteCustomerProps {
  id: string;
}

const DeleteCustomerBtn: React.FC<DeleteCustomerProps> = ({ id }) => {
  const [open, setOpen] = useState(false);
  const tCommon = useTranslations("common");
  const tCustomers = useTranslations("addNewCustomerModal");

  const DeleteCustomerByID = async () => {
    const response = await DeleteCustomer(id);
    if (response.status === "ok") {
      toast.success(tCustomers("customerDeleted") || "Customer successfully deleted");
      setOpen(false);
    } else {
      // Show specific error message or a generic one
      if (response.message.includes("associated")) {
        toast.error(tCustomers("customerInUseCannotDelete") || response.message);
      } else {
        toast.error(
          response.message ||
            tCommon("unexpected_error_occurred") ||
            "Failed to delete the customer"
        );
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className=" bg-red-500 hover:bg-red-500/80 text-center w-full p-2 rounded-md">
        {tCommon("delete")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-[100]">
        <DialogHeader dir="rtl" className="flex items-center ">
          <DialogTitle dir="ltr">{tCommon("areYouSure")}</DialogTitle>
          <DialogDescription className="w-full flex gap-2">
            <Button onClick={DeleteCustomerByID} className={cn("w-full")} variant={"destructive"}>
              {tCommon("delete")}
            </Button>
            <Button onClick={() => setOpen(false)} className={cn("w-full bg-slate-400")}>
              {tCommon("cancel")}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCustomerBtn;
