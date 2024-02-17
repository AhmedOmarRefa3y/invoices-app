import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";

import { CreateCustomer, UpdateCustomer } from "@/actions/customer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useInvoice from "@/lib/zustand";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import Formbtn from "../ui/Form-btn";

export function AddNewCustomerModalNEW() {
    const Invoice = useInvoice();
    const {
        customerToBeEdited,
        AddcustomerModalIsOpen,
        SetAddcustomerModalIsOpen,
        ClearCustomerToBeEdited,
    } = Invoice;

    const [formData, setFormData] = useState({
        customerName: "",
        location: "",
        phoneNumber: "",
        OpenCredit: 0,
    });

    const CreditTypes = [
        { id: 1, name: "مدين" },
        { id: 2, name: "دائن" },
    ];
    const [CreditType, setCreditType] = useState<undefined | number>(undefined);

    const onSubmit = async () => {
        const OpenCredit =
            CreditType === 2 ? formData.OpenCredit * -1 : formData.OpenCredit;
        if (formData.customerName.length < 2) {
            toast.error("اسم العميل قصير جدا");
            return;
        }
        if (!customerToBeEdited) {
            const res = await CreateCustomer({
                ...formData,
                OpenCredit,
            });
            console.log(res);
            if (res.status === "ok") {
                SetAddcustomerModalIsOpen(false);
                setFormData({
                    customerName: "",
                    location: "",
                    phoneNumber: "",
                    OpenCredit: 0,
                });
                toast.success("تم اضافة عميل بنجاح");
            } else {
                toast.error(res.message);
            }
        }
        if (customerToBeEdited) {
            const res = await UpdateCustomer({
                id: customerToBeEdited?.customerId,
                ...formData,
                OpenCredit,
            });
            console.log(res);
            if (res.status === "ok") {
                SetAddcustomerModalIsOpen(false);
                setFormData({
                    customerName: "",
                    location: "",
                    phoneNumber: "",
                    OpenCredit: 0,
                });
                toast.success("تم اضافة عميل بنجاح");
            } else {
                toast.error(res.message);
            }
        }
    };
    useEffect(() => {
        if (customerToBeEdited) {
            setFormData({
                customerName: customerToBeEdited.customerName,
                location: customerToBeEdited.address,
                phoneNumber: customerToBeEdited.PhoneNumber,
                OpenCredit:
                    customerToBeEdited.OpenCredit > 1
                        ? customerToBeEdited.OpenCredit
                        : customerToBeEdited.OpenCredit * -1,
            });

            customerToBeEdited?.OpenCredit > 0
                ? setCreditType(1)
                : customerToBeEdited?.OpenCredit < 0
                ? setCreditType(2)
                : setCreditType(undefined);
        }
    }, [customerToBeEdited]);

    const closeMOdal = () => {
        SetAddcustomerModalIsOpen(!AddcustomerModalIsOpen);
        setFormData({
            customerName: "",
            location: "",
            phoneNumber: "",
            OpenCredit: 0,
        });
        ClearCustomerToBeEdited();
    };
    return (
        <Dialog open={AddcustomerModalIsOpen} onOpenChange={closeMOdal}>
            <DialogTrigger asChild>
                <Button variant="outline">اضافة عميل</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>
                        {customerToBeEdited ? "تعديل عميل" : "اضافة عميل"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap"
                >
                    <div className="basis-[190px]">
                        <label>اسم العميل</label>
                        <Input
                            placeholder="قم بإدخال اسم العميل هنا"
                            value={formData.customerName}
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
                                    customerName: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="basis-[190px]">
                        <label>العنوان</label>
                        <Input
                            placeholder="قم بإدخال العنوان هنا"
                            value={formData.location}
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
                                    location: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="basis-[100%] flex gap-1">
                        <div className="basis-[50%]">
                            <label>نوع الرصيد</label>
                            <div className="flex items-center flex-col f">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            role="combobox"
                                            className={cn(
                                                `  justify-center gap-1  w-full h-10`
                                            )}
                                        >
                                            {CreditType
                                                ? CreditTypes.find(
                                                      (ModeItem) =>
                                                          ModeItem.id ===
                                                          CreditType
                                                  )?.name
                                                : "نوع الرصيد"}
                                            <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className=" w-fit">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {CreditTypes.map((Type) => (
                                                        <div
                                                            key={Type.id}
                                                            className=" flex justify-between items-center "
                                                        >
                                                            <CommandItem
                                                                key={Type.id}
                                                                onSelect={() => {
                                                                    setCreditType(
                                                                        Type.id ===
                                                                            CreditType
                                                                            ? undefined
                                                                            : Type.id
                                                                    );
                                                                }}
                                                                className="text-sm w-full text-center"
                                                            >
                                                                <span className="w-full text-lg">
                                                                    {Type.name}
                                                                </span>
                                                                <Check
                                                                    className={cn(
                                                                        "mr-auto w-4",
                                                                        Type.id ===
                                                                            CreditType
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        </div>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="basis-[50%]">
                            <label>الرصيد الافتاحي</label>
                            <Input
                                type="number"
                                placeholder="قم بإدخال الرصيد الافتتاحي"
                                value={formData.OpenCredit}
                                onChange={(e) => {
                                    setFormData((perv) => ({
                                        ...perv,
                                        OpenCredit: e.target.valueAsNumber,
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <div className="basis-[190px]">
                        <label>رقم التليفون</label>
                        <Input
                            placeholder="قم بإدخال الرقم هنا"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
                                    phoneNumber: e.target.value,
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
