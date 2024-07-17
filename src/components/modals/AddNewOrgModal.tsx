"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/org-dialog";
import useInvoice from "@/lib/zustand/invoiceStore";
import Formbtn from "../ui/Form-btn";
import { useIsClient } from "@uidotdev/usehooks";
import { CreateOrg } from "@/actions/newOrg";
import { redirect, useRouter } from "next/navigation";
import useModals from "@/lib/zustand/useModals";

export function AddNewOrgModal() {
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
                    <DialogTitle>اضافة منظمة</DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap sm:flex-nowrap mt-3 "
                >
                    <div className="w-full">
                        <label>اسم المنظمة</label>
                        <Input
                            placeholder="قم بإدخال اسم المنظمة هنا"
                            value={formData.OrgName}
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
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
