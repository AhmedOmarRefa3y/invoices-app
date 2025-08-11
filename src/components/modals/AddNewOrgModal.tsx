"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/org-dialog";
import Formbtn from "../ui/Form-btn";
import { useIsClient } from "@uidotdev/usehooks";
import { CreateOrg } from "@/actions/newOrg";
import { redirect } from "next/navigation";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";

export function AddNewOrgModal() {
  const t = useTranslations("addNewOrgModal");
  const Modals = useModals();
  const isClient = useIsClient();
  const { addOrgMOdalIsOpen, setAddOrgModalIsOpen } = Modals;

  const [formData, setFormData] = useState({
    OrgName: "",
  });

  const onSubmit = async () => {
    const res = await CreateOrg({ OrgName: formData.OrgName });
    if (res.status === "ok") {
      setFormData({
        OrgName: "",
      });
      redirect(`/${res.Data?.id}`);
    }
  };

  const closeMOdal = () => {
    setAddOrgModalIsOpen(!addOrgMOdalIsOpen);
    setFormData({
      OrgName: "",
    });
  };
  if (!isClient) return null;

  return (
    <Dialog open={addOrgMOdalIsOpen} onOpenChange={closeMOdal}>
      <DialogContent className="sm:max-w-md w-full">
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
