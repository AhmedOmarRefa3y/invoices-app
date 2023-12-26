import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { UpdateCustomer } from "@/actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import useInvoice from "@/lib/zustand";
import toast from "react-hot-toast";

const formSchema = z.object({
    customerName: z.string().min(2, {
        message: "Customer Name must be at least 5 characters.",
    }),
    location: z.string().optional(),
    phoneNumber: z.string().optional(),
    OpenCredit: z.number().optional(),
});

export function AddNewCustomerModal() {
    const CreditTypes = [
        { id: 1, name: "مدين" },
        { id: 2, name: "دائن" },
    ];
    const Invoice = useInvoice();
    const {
        customerToBeEdited,
        AddcustomerModalIsOpen,
        SetAddcustomerModalIsOpen,
        ClearCustomerToBeEdited,
    } = Invoice;

    const [CreditType, setCreditType] = useState<undefined | number>(undefined);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            location: "",
            phoneNumber: "",
            OpenCredit: 0,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const CustomerCredit =
            values.OpenCredit && CreditType === 1
                ? values.OpenCredit
                : values?.OpenCredit
                ? values?.OpenCredit * -1
                : null;

        const data = {
            ...values,
            CustomerCredit,
        };
        console.log(data);

        const res = await axios.post("/api/addnewcustomer", data);
        console.log(res);
        SetAddcustomerModalIsOpen(false);
        router.refresh();
        form.reset;
        return res;
    }
    async function UpdateCustomerdsad(values: z.infer<typeof formSchema>) {
        const CustomerCredit =
            values.OpenCredit && CreditType === 1
                ? values.OpenCredit
                : values?.OpenCredit && CreditType === 2
                ? values?.OpenCredit * -1
                : null;

        const data = {
            ...values,
            CustomerCredit,
            id: customerToBeEdited?.customerId,
        };

        const UpdatedCustomer = await UpdateCustomer(data);
        console.log(UpdatedCustomer);
        if (UpdatedCustomer) {
            ClearCustomerToBeEdited();
            SetAddcustomerModalIsOpen(false);
            router.refresh();
            form.reset;
            toast.success("تم تعديل بيانات العميل بنجاح");
        } else {
            toast.error("لم يتم تعديل بيانات العميل ");
        }
    }
    useEffect(() => {
        form.setValue(
            "OpenCredit",
            customerToBeEdited?.OpenCredit ? customerToBeEdited?.OpenCredit : 0
        );
        form.setValue(
            "customerName",
            customerToBeEdited?.customerName
                ? customerToBeEdited?.customerName
                : ""
        );
        form.setValue(
            "location",
            customerToBeEdited?.address ? customerToBeEdited?.address : ""
        );
        form.setValue(
            "phoneNumber",
            customerToBeEdited?.PhoneNumber
                ? customerToBeEdited?.PhoneNumber
                : ""
        );

        customerToBeEdited && customerToBeEdited?.OpenCredit >= 0
            ? setCreditType(1)
            : setCreditType(2);
    }, [customerToBeEdited, form]);
    const closeMOdal = () => {
        SetAddcustomerModalIsOpen(!AddcustomerModalIsOpen);
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
                <Form {...form}>
                    <form
                        onSubmit={
                            customerToBeEdited
                                ? form.handleSubmit(UpdateCustomerdsad)
                                : form.handleSubmit(onSubmit)
                        }
                        className="flex items-end justify-center gap-2 w-full flex-wrap"
                    >
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="customerName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم العميل</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قم بإدخال اسم العميل هنا"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>العنوان</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قم بإدخال اسم العميل هنا"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="basis-[100%] flex gap-1">
                            <div className="basis-[50%]">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>نوع الرصيد</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center flex-col f">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={
                                                                    "outline"
                                                                }
                                                                size="sm"
                                                                role="combobox"
                                                                className={cn(
                                                                    `  justify-center gap-1  w-full h-10`
                                                                )}
                                                            >
                                                                {CreditType
                                                                    ? CreditTypes.find(
                                                                          (
                                                                              ModeItem
                                                                          ) =>
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
                                                                        {CreditTypes.map(
                                                                            (
                                                                                Type
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        Type.id
                                                                                    }
                                                                                    className=" flex justify-between items-center "
                                                                                >
                                                                                    <CommandItem
                                                                                        key={
                                                                                            Type.id
                                                                                        }
                                                                                        onSelect={() => {
                                                                                            setCreditType(
                                                                                                Type.id
                                                                                            );
                                                                                        }}
                                                                                        className="text-sm w-full text-center"
                                                                                    >
                                                                                        <span className="w-full text-lg">
                                                                                            {
                                                                                                Type.name
                                                                                            }
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
                                                                            )
                                                                        )}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="basis-[50%]">
                                <FormField
                                    control={form.control}
                                    name="OpenCredit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                الرصيد الافتاحي
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="قم بإدخال الرصيد الافتتاحي"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target
                                                                .valueAsNumber
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم التليفون</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قم بإدخال الرقم هنا"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="basis-[190px]">
                            إضافة
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
