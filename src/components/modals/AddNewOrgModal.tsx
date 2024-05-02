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
import { redirect } from "next/navigation";

export function AddNewOrgModal() {
    const Invoice = useInvoice();
    const isClient = useIsClient();
    const { addOrgMOdalIsOpen, setAddOrgModalIsOpen } = Invoice;

    const [formData, setFormData] = useState({
        OrgName: "",
    });

    const onSubmit = async () => {
        const res = await CreateOrg({ OrgName: formData.OrgName });
        // console.log(res);
        if (res.status === "ok") {
            console.log("done");

            setAddOrgModalIsOpen(false);
            setFormData({
                OrgName: "",
            });
            Invoice.setAddOrgModalIsOpen(false);
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>اضافة منظمة</DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap"
                >
                    <div className="basis-[190px]">
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
