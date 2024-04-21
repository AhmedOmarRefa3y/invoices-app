"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { CreateUnit } from "@/app/actions/newOrg";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useIsClient } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import Formbtn from "../ui/Form-btn";
import { useParams } from "next/navigation";

export function AddNewUnitModal() {
    const Invoice = useInvoice();
    const isClient = useIsClient();
    const params: { orgid: string } = useParams();
    const { addUnitMOdalIsOpen, setAddUnitModalIsOpen } = Invoice;

    const [formData, setFormData] = useState({
        UnitName: "",
    });

    const onSubmit = async () => {
        const res = await CreateUnit({
            UnitName: formData.UnitName,
            orgID: params.orgid,
        });
        // console.log(res);
        if (res.status === "ok") {
            console.log("done");
            toast.success("تم اضافة الوحدة بنجاح");
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>اضافة وحدة</DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap"
                >
                    <div className="basis-[190px]">
                        <label>اسم الوحدة</label>
                        <Input
                            placeholder="قم بإدخال اسم الوحدة هنا"
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
