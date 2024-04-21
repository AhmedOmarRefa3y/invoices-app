"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { CreateInventory } from "@/app/actions/newOrg";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import useInvoice from "@/lib/zustand/invoiceStore";
import { useIsClient } from "@uidotdev/usehooks";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Formbtn from "../ui/Form-btn";

export default function AddNewCategoryModal() {
    const Invoice = useInvoice();
    const isClient = useIsClient();
    const params: { orgid: string } = useParams();
    const { addInventoryIsOpen, setAddInventoryModalIsOpen } = Invoice;

    const [formData, setFormData] = useState({
        InventoryName: "",
    });

    const onSubmit = async () => {
        const res = await CreateInventory({
            InventoryName: formData.InventoryName,
            orgID: params.orgid,
        });
        // console.log(res);
        if (res.status === "ok") {
            console.log("done");
            toast.success("تم اضافة المخزن بنجاح");
            setAddInventoryModalIsOpen(false);
            setFormData({
                InventoryName: "",
            });
        } else {
            toast.error(res.message);
        }
    };

    const closeMOdal = () => {
        setAddInventoryModalIsOpen(false);
        setFormData({
            InventoryName: "",
        });
    };
    if (!isClient) return null;

    return (
        <Dialog open={addInventoryIsOpen} onOpenChange={closeMOdal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>اضافة مخزن</DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap"
                >
                    <div className="basis-[190px]">
                        <label>اسم المخزن</label>
                        <Input
                            placeholder="قم بإدخال اسم المخزن هنا"
                            value={formData.InventoryName}
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
                                    InventoryName: e.target.value,
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
