"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Formbtn from "../ui/Form-btn";
import { useIsClient } from "@uidotdev/usehooks";
import { CreateOrg } from "@/actions/newOrg";
import { useRouter } from "@/i18n/routing";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";

export function AddNewOrgModal() {
  const t = useTranslations("addNewOrgModal");
  const Modals = useModals();
  const isClient = useIsClient();
  const router = useRouter();
  const { addOrgMOdalIsOpen, setAddOrgModalIsOpen } = Modals;

  const [formData, setFormData] = useState({
    OrgName: "",
  });

  // Debugging: log when the modal state changes
  useEffect(() => {
    console.log("AddNewOrgModal state changed:", addOrgMOdalIsOpen);
  }, [addOrgMOdalIsOpen]);

  // Debugging: log when component mounts
  useEffect(() => {
    console.log("AddNewOrgModal mounted");
    return () => {
      console.log("AddNewOrgModal unmounted");
    };
  }, []);

  const onSubmit = async () => {
    const res = await CreateOrg({ OrgName: formData.OrgName });
    if (res.status === "ok") {
      setFormData({
        OrgName: "",
      });
      // Close the modal
      setAddOrgModalIsOpen(false);
      // Navigate to the new organization
      router.push(`/${res.Data?.id}`);
    }
  };

  const closeMOdal = () => {
    console.log("Closing modal");
    setAddOrgModalIsOpen(!addOrgMOdalIsOpen);
    setFormData({
      OrgName: "",
    });
  };
  
  if (!isClient) {
    console.log("AddNewOrgModal: not client side, returning null");
    return null;
  }

  // Add visual debugging
  console.log("Rendering AddNewOrgModal with open state:", addOrgMOdalIsOpen);

  // Add a visible indicator when the modal should be open
  if (addOrgMOdalIsOpen) {
    console.log("Modal should be visible!");
  }

  return (
    <Dialog open={addOrgMOdalIsOpen} onOpenChange={closeMOdal}>
      <DialogContent className="sm:max-w-md w-full z-[100]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{t("new_organization")}</DialogTitle>
        </DialogHeader>

        <form
          action={onSubmit}
          className="flex items-end justify-center gap-2 w-full flex-wrap sm:flex-nowrap mt-3 "
        >
          <div className="w-full">
            <label>{t("organization_name")}</label>
            <Input
              placeholder={t("organization_name_placeholder")}
              value={formData.OrgName}
              onChange={(e) => {
                setFormData(() => ({
                  OrgName: e.target.value,
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
