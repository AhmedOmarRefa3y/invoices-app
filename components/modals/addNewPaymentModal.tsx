"use client";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Customer } from "@prisma/client";
import axios from "axios";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import { CommandList } from "cmdk";
import InvoiceDate from "@/app/addinvoice/components/InvoiceDate";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

const formSchema = z.object({
    CustomerId: z.string().min(2, {
        message: "CustomerId must be at least 5 characters.",
    }),
    amount: z.coerce.number().min(1),
    Note: z.string().optional(),
});

interface addNewPaymentModalProps {
    customers: Customer[];
}

const AddNewPaymentModal: React.FC<addNewPaymentModalProps> = ({
    customers,
}) => {
    const invoice = useInvoice();
    const [lodaing, setlodaing] = useState(false);
    const [IsPopoverOpen, setPopoverOpen] = useState(false);
    const [PaymentType, SetPaymentType] = useState<null | string>(null);
    const [Method, SetMethod] = useState<null | string>(null);
    const [PaymentDate, setPaymentDate] = useState<Date | undefined>(
        new Date()
    );
    const PaymentTypes = [
        { id: 1, type: "سداد" },
        { id: 2, type: "خصم" },
        { id: 3, type: "مشتريات" },
    ];
    const Methods = [
        { id: 1, type: "نقدي" },
        { id: 2, type: "تحويل بنكي" },
        { id: 3, type: "شيك" },
        { id: 3, type: "خصم" },
    ];
    const {
        AddPaymentModalIsOpen,
        SetAddPaymentModalIsOpen,
        PaymentToBeEdited,
    } = invoice;

    const router = useRouter();

    const mode = PaymentToBeEdited ? "edit" : "create";
    const headerName = mode === "edit" ? "تعديل مدفوعة" : "اضافة مدفوعة";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: PaymentToBeEdited ? PaymentToBeEdited.amount : 0,
            CustomerId: PaymentToBeEdited?.id ? PaymentToBeEdited?.id : "",
            Note: "",
        },
    });

    // set Payment values
    useEffect(() => {
        form.setValue(
            "amount",
            PaymentToBeEdited ? PaymentToBeEdited.amount : 0
        );
        form.setValue(
            "CustomerId",
            PaymentToBeEdited ? PaymentToBeEdited.id : ""
        );
    }, [PaymentToBeEdited, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setlodaing(true);

        let PaymentInfo = {
            ...values,
            PaymentId: PaymentToBeEdited?.id,
            PaymentDate,
            PaymentType,
            Method,
        };

        const res = await axios.post("/api/payments", PaymentInfo);
        if (res.status === 200) {
            if (PaymentToBeEdited) {
                toast.success("تم تعديل الصنف بنجاح");
            } else {
                toast.success("تم اضافة الصنف بنجاح");
            }
            router.refresh();
            SetAddPaymentModalIsOpen(false);
        }
        setlodaing(false);

        return res;
    }
    console.log("newPaymentRenderd");

    return (
        <Dialog
            open={AddPaymentModalIsOpen}
            onOpenChange={SetAddPaymentModalIsOpen}
        >
            <DialogContent className="sm:max-w-md transition-all  shadow-lg bg-orange-200 ">
                <DialogHeader className="flex items-center">
                    <DialogTitle>{headerName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        // className="grid grid-cols-2 justify-center items-end gap-2"
                        className="flex items-center justify-center gap-2 w-full flex-wrap"
                    >
                        <div className="basis-[190px]">
                            <Popover>
                                <div className="flex flex-col ">
                                    <label htmlFor="">تاريخ المدفوعة</label>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full flex justify-between text-left font-normal",
                                                !Date && "text-muted-foreground"
                                            )}
                                        >
                                            {PaymentDate ? (
                                                format(
                                                    new Date(PaymentDate),
                                                    "PPP"
                                                )
                                            ) : (
                                                <span>اختر التاريخ</span>
                                            )}
                                            <CalendarIcon className="mr-2 h-4 w-4 " />
                                        </Button>
                                    </PopoverTrigger>
                                </div>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={PaymentDate}
                                        onSelect={(value) =>
                                            setPaymentDate(value)
                                        }
                                        initialFocus
                                        dir="rtl"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="basis-[190px]">
                            <label htmlFor="">نوع المدفوعة</label>
                            <Popover>
                                <div className="overflow-hidden ">
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            role="combobox"
                                            aria-expanded={IsPopoverOpen}
                                            className={cn(
                                                `w-full  justify-center gap-1 h-[40px] `
                                            )}
                                        >
                                            {PaymentTypes
                                                ? PaymentTypes.find(
                                                      (unit) =>
                                                          unit.type ===
                                                          PaymentType
                                                  )?.type
                                                : "نوع السند"}
                                            <ChevronsUpDown className="mr-auto  w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                </div>
                                <PopoverContent className=" p-2 w-fit">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {PaymentTypes.map((type) => (
                                                    <div
                                                        className=" flex justify-between items-center "
                                                        key={type.id}
                                                    >
                                                        <CommandItem
                                                            key={type.id}
                                                            onSelect={() => {
                                                                // console.log(
                                                                //     unit.name
                                                                // );
                                                                SetPaymentType(
                                                                    type.type
                                                                );
                                                            }}
                                                            className="text-sm w-full text-center"
                                                        >
                                                            <span className="w-full">
                                                                {type.type}
                                                            </span>
                                                            <Check
                                                                className={cn(
                                                                    "mr-auto w-4",
                                                                    PaymentType ===
                                                                        type.type
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
                        <div className="basis-[190px]">
                            <label htmlFor="">طريقة السداد</label>
                            <Popover>
                                <div className="overflow-hidden ">
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            role="combobox"
                                            aria-expanded={IsPopoverOpen}
                                            className={cn(
                                                `w-full justify-center gap-1 h-[40px] `
                                            )}
                                        >
                                            {Methods
                                                ? Methods.find(
                                                      (unit) =>
                                                          unit.type === Method
                                                  )?.type
                                                : "نوع السند"}
                                            <ChevronsUpDown className="  w-4 shrink-0 mr-auto opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                </div>
                                <PopoverContent className=" p-2  w-fit">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {Methods.map((type) => (
                                                    <div
                                                        className=" flex justify-between items-center "
                                                        key={type.id}
                                                    >
                                                        <CommandItem
                                                            key={type.id}
                                                            onSelect={() => {
                                                                // console.log(
                                                                //     unit.name
                                                                // );
                                                                SetMethod(
                                                                    type.type
                                                                );
                                                            }}
                                                            className="text-sm w-full text-center"
                                                        >
                                                            <span className="w-full">
                                                                {type.type}
                                                            </span>
                                                            <Check
                                                                className={cn(
                                                                    "mr-auto w-4",
                                                                    Method ===
                                                                        type.type
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
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="CustomerId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>اسم العميل</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            " justify-between ",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? customers.find(
                                                                  (customer) =>
                                                                      customer.id ===
                                                                      field.value
                                                              )?.name
                                                            : "اختر اسم العميل"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="ابحث عن عميل بالاسم" />
                                                    <CommandEmpty>
                                                        لا يوجد عميل بهذا الاسم
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {customers.map(
                                                            (customer) => (
                                                                <CommandItem
                                                                    value={
                                                                        customer.name
                                                                    }
                                                                    key={
                                                                        customer.id
                                                                    }
                                                                    onSelect={() => {
                                                                        form.setValue(
                                                                            "CustomerId",
                                                                            customer.id
                                                                        );
                                                                        // console.log(
                                                                        //     form.watch()
                                                                        // );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            customer.id ===
                                                                                field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {
                                                                        customer.name
                                                                    }
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="basis-[190px]">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>القيمة</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="قم بإدخال سعر الصنف هنا"
                                                {...field}
                                                type="number"
                                                className="text-center"
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
                                name="Note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ملاحظات</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="mt-0 space-y-0"
                                                placeholder="قم بإدخال الملاحظات هنا"
                                                {...field}
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="basis-[190px]"
                            disabled={lodaing}
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewPaymentModal;
