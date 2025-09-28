"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { CreateUnit } from "@/actions/newOrg";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsClient } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import Formbtn from "../ui/Form-btn";
import { useParams } from "next/navigation";
import useModals from "@/lib/zustand/useModals";

export function AddNewUnitModal() {
  const Modals = useModals();
  const isClient = useIsClient();
  const params: { orgid: string } = useParams();
  const { addUnitMOdalIsOpen, setAddUnitModalIsOpen } = Modals;

  const [formData, setFormData] = useState({
    UnitName: "",
  });

  const onSubmit = async () => {
    const res = await CreateUnit({
      UnitName: formData.UnitName,
      orgID: params.orgid,
    });
    if (res.status === "ok") {
      console.log("done");
      toast.success("Unit added successfully");
      setAddUnitModalIsOpen(false);
      setFormData({
        UnitName: "",
      });
    } else {
      toast.error(res.message);
    }
  };

  const closeMOdal = () => {
    setAddUnitModalIsOpen(false);
    setFormData({
      UnitName: "",
    });
  };
  if (!isClient) return null;

  return (
    <Dialog open={addUnitMOdalIsOpen} onOpenChange={closeMOdal}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>Add New Unit</DialogTitle>
        </DialogHeader>

        <form
          action={onSubmit}
          className="flex items-end justify-center gap-2 w-full flex-wrap sm:flex-nowrap mt-3 "
        >
          <div className="w-full">
            <label className="font-bold text-lg">Name</label>
            <Input
              placeholder="Name"
              value={formData.UnitName}
              onChange={(e) => {
                setFormData((perv) => ({
                  ...perv,
                  UnitName: e.target.value,
                }));
              }}
            />
          </div>
          <Formbtn />
        </form>
      </DialogContent>
    </Dialog>
  );
}
