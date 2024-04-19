import useInvoice from "@/lib/zustand/invoiceStore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateCustomer, UpdateCustomer } from "@/app/actions/customer";

import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Formbtn from "../ui/Form-btn";

import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function AddNewCustomerModalNEW() {
    const params: { orgid: string } = useParams();
    const Invoice = useInvoice();
    const {
        customerToBeEdited,
        AddcustomerModalIsOpen,
        SetAddcustomerModalIsOpen,
        ClearCustomerToBeEdited,
    } = Invoice;

    const [formData, setFormData] = useState<{
        customerName: string;
        location: string;
        phoneNumber: string;
        OpenCredit: number;
    }>({
        customerName: "",
        location: "",
        phoneNumber: "",
        OpenCredit: 0,
    });

    const CreditTypes = [
        { id: "1", name: "مدين" },
        { id: "2", name: "دائن" },
    ];
    const [CreditTypeID, setCreditTypeID] = useState<undefined | string>(
        undefined
    );

    const onSubmit = async () => {
        const OpenCredit =
            CreditTypeID === "2"
                ? formData.OpenCredit * -1
                : formData.OpenCredit;
        if (formData.customerName.length < 2) {
            toast.error("اسم العميل قصير جدا");
            return;
        }
        if (!customerToBeEdited) {
            const res = await CreateCustomer({
                ...formData,
                OpenCredit,
                orgid: params.orgid,
            });
            // console.log(res);
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
            // console.log(res);
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
                ? setCreditTypeID("1")
                : customerToBeEdited?.OpenCredit < 0
                ? setCreditTypeID("2")
                : setCreditTypeID(undefined);
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
            <DialogContent className="sm:max-w-md border-stone-300 shadow-lg border font-bold w-[98%]">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>
                        {customerToBeEdited ? "تعديل عميل" : "اضافة عميل"}
                    </DialogTitle>
                </DialogHeader>
                <form
                    action={onSubmit}
                    className="flex items-end justify-center gap-2 w-full flex-wrap font-bold"
                >
                    <div className="lg:basis-[190px] w-full">
                        <label className="whitespace-nowrap">اسم العميل</label>
                        <Input
                            className="font-bold border-stone-300"
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
                    <div className="lg:basis-[190px] w-full">
                        <label className=" whitespace-nowrap">العنوان</label>
                        <Input
                            placeholder="قم بإدخال العنوان هنا"
                            value={formData.location}
                            className="font-bold border-stone-300"
                            onChange={(e) => {
                                setFormData((perv) => ({
                                    ...perv,
                                    location: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-1 col-span-2">
                        <div className="lg:basis-[50%] w-full overflow-hidden">
                            <label className="whitespace-nowrap ">
                                الرصيد الافتاحي
                            </label>
                            <Input
                                type="number"
                                placeholder="قم بإدخال الرصيد الافتتاحي"
                                value={formData.OpenCredit}
                                min={0}
                                className="text-center font-bold border-stone-300 overflow-hidden"
                                onChange={(e) => {
                                    setFormData((perv) => ({
                                        ...perv,
                                        OpenCredit: e.target.valueAsNumber,
                                    }));
                                }}
                            />
                        </div>
                        <div className="basis-[50%] overflow-hidden">
                            <label className="whitespace-nowrap">
                                نوع الرصيد
                            </label>
                            <div className="flex items-center flex-col f">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            role="combobox"
                                            className={cn(
                                                `  gap-1  w-full h-10 flex justify-between font-bold border-stone-300 overflow-hidden`
                                            )}
                                        >
                                            {CreditTypeID
                                                ? CreditTypes.find(
                                                      (Type) =>
                                                          Type.id ===
                                                          CreditTypeID
                                                  )?.name
                                                : " نوع الرصيد الافتتاحي"}
                                            <ChevronsUpDown className="  w-4 shrink-0  font-bold" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-1 border-stone-300 border ">
                                        <Command>
                                            <CommandList>
                                                <CommandGroup>
                                                    {CreditTypes.map((Type) => (
                                                        <div
                                                            key={Type.id}
                                                            className=" flex justify-between items-center w-full "
                                                        >
                                                            <CommandItem
                                                                key={Type.id}
                                                                onSelect={() => {
                                                                    setCreditTypeID(
                                                                        Type.id ===
                                                                            CreditTypeID
                                                                            ? undefined
                                                                            : Type.id
                                                                    );
                                                                }}
                                                                className="text-sm w-full  flex border   border-b-stone-300 "
                                                            >
                                                                <span className="w-full text-lg ">
                                                                    {Type.name}
                                                                </span>
                                                                <Check
                                                                    className={cn(
                                                                        "mr-auto w-4",
                                                                        Type.id ===
                                                                            CreditTypeID
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
                    </div>
                    <div className="lg:basis-[190px] w-full">
                        <label className=" whitespace-nowrap">
                            رقم التليفون
                        </label>
                        <Input
                            placeholder="قم بإدخال الرقم هنا"
                            value={formData.phoneNumber}
                            type="number"
                            min={1}
                            className="font-bold border-stone-300"
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
