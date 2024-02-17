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
import { CommandList } from "cmdk";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { CreatePayment, EditPayment } from "@/actions/payments";

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
    const [Method, SetMethod] = useState<undefined | string>(undefined);
    const [PaymentDate, setPaymentDate] = useState<Date | undefined>(
        new Date()
    );
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
        clearPaymentToBeEdited,
    } = invoice;

    const mode = PaymentToBeEdited ? "edit" : "create";
    const headerName = mode === "edit" ? "تعديل مدفوعة" : "اضافة مدفوعة";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: PaymentToBeEdited?.amount ? PaymentToBeEdited.amount : 0,
            CustomerId: PaymentToBeEdited?.customerId
                ? PaymentToBeEdited?.customerId
                : "",
            Note: PaymentToBeEdited?.Note ? PaymentToBeEdited?.Note : "",
        },
    });

    useEffect(() => {
        form.setValue(
            "amount",
            PaymentToBeEdited?.amount ? PaymentToBeEdited.amount : 0
        );
        form.setValue(
            "CustomerId",
            PaymentToBeEdited?.customerId ? PaymentToBeEdited.customerId : ""
        );
        form.setValue(
            "Note",
            PaymentToBeEdited?.Note ? PaymentToBeEdited.Note : ""
        );

        SetMethod(PaymentToBeEdited?.method);
        setPaymentDate(PaymentToBeEdited?.date || new Date());
    }, [PaymentToBeEdited, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setlodaing(true);
        PaymentDate?.getHours() === 0 ? PaymentDate.setHours(22) : null;
        let PaymentInfo = {
            ...values,
            PaymentId: PaymentToBeEdited?.id,
            PaymentDate: PaymentDate,
            Method: Method || "",
        };

        if (!PaymentToBeEdited) {
            const CreateNewPayment = await CreatePayment(PaymentInfo);
            if (CreateNewPayment.status === "ok") {
                toast.success("تم تسجيل الاشعار بنجاح");
                SetAddPaymentModalIsOpen(false);
                form.reset();
                SetMethod(undefined);
            } else {
                toast.error(CreateNewPayment.message);
            }
            setlodaing(false);
        } else {
            const UpdateExistingPayment = await EditPayment(PaymentInfo);
            if (UpdateExistingPayment.status === "ok") {
                toast.success("تم تعديل الاشعار بنجاح");
                SetAddPaymentModalIsOpen(false);
                form.reset();
                SetMethod(undefined);
            } else {
                toast.error(UpdateExistingPayment.message);
            }
            setlodaing(false);
        }
    }

    const closeModal = () => {
        SetAddPaymentModalIsOpen(false);
        clearPaymentToBeEdited();
    };

    return (
        <Dialog open={AddPaymentModalIsOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md transition-all  shadow-lg bg-orange-200 ">
                <DialogHeader className="flex items-center">
                    <DialogTitle>{headerName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex items-end justify-center gap-2 w-full flex-wrap"
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
                            <label htmlFor="">طريقة السداد</label>
                            <Popover>
                                <div className="overflow-hidden ">
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            size="sm"
                                            role="combobox"
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
                                            <PopoverContent className=" p-0 ">
                                                <Command className="h-56 ">
                                                    <CommandInput placeholder="ابحث عن عميل بالاسم" />
                                                    <CommandEmpty>
                                                        لا يوجد عميل بهذا الاسم
                                                    </CommandEmpty>
                                                    <CommandGroup className="overflow-y-scroll">
                                                        {customers.map(
                                                            (customer) => (
                                                                <CommandItem
                                                                    className={`border-b-2 border-gray-300 rounded-none flex justify-between ${
                                                                        form.getValues(
                                                                            "CustomerId"
                                                                        ) ===
                                                                        customer.id
                                                                            ? "bg-orange-300"
                                                                            : null
                                                                    } `}
                                                                    value={
                                                                        customer.name
                                                                    }
                                                                    key={
                                                                        customer.id
                                                                    }
                                                                    onSelect={() => {
                                                                        form.setValue(
                                                                            "CustomerId",
                                                                            form.getValues(
                                                                                "CustomerId"
                                                                            ) ===
                                                                                customer.id
                                                                                ? ""
                                                                                : customer.id
                                                                        );
                                                                    }}
                                                                >
                                                                    {
                                                                        customer.name
                                                                    }
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            customer.id ===
                                                                                field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
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
                            حفظ
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewPaymentModal;
