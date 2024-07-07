"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

import { CreateInventory } from "@/actions/newOrg";
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
import useModals from "@/lib/zustand/useModals";

export function AddNewCategoryModal() {
    const Modals = useModals();
    const isClient = useIsClient();
    const params: { orgid: string } = useParams();
    const { addInventoryIsOpen, setAddInventoryModalIsOpen } = Modals;

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
            <DialogContent className="sm:max-w-md w-full">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>اضافة مخزن</DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap sm:flex-nowrap mt-3 "
                >
                    <div className="w-full">
                        <label className="font-bold text-lg">اسم المخزن</label>
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
