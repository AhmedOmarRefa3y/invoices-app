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
import useInvoice from "@/lib/zustand/invoiceStore";
import { CommandList } from "cmdk";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { CreatePayment, EditPayment } from "@/actions/payments";
import { useParams } from "next/navigation";
import { CustomerT } from "@/lib/types";
import useModals from "@/lib/zustand/useModals";

const formSchema = z.object({
    CustomerId: z.string().min(2, {
        message: "CustomerId must be at least 5 characters.",
    }),
    amount: z.coerce.number().min(1),
    Note: z.string().optional(),
});

interface addNewPaymentModalProps {
    customers: Pick<CustomerT, "id" | "name">[];
}

const AddNewPaymentModal: React.FC<addNewPaymentModalProps> = ({
    customers,
}) => {
    const params: { orgid: string } = useParams();
    const ModalsStore = useModals();
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
    } = ModalsStore;

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
            orgid: params.orgid,
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
            <DialogContent className="md:w-fit w-[98%]  transition-all  shadow-2xl border border-stone-300 bg-white p-2  ">
                <DialogHeader className="flex items-center mt-2">
                    <DialogTitle>{headerName}</DialogTitle>
                </DialogHeader>
                <div className=" py-4 rounded-lg">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end"
                        >
                            <div className="w-full">
                                <Popover>
                                    <div className="flex flex-col ">
                                        <label htmlFor="">تاريخ المدفوعة</label>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full flex justify-between text-left font-bold border border-stone-300 ",
                                                    !Date &&
                                                        "text-muted-foreground"
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
                                    <PopoverContent className=" p-0">
                                        <Calendar
                                            mode="single"
                                            selected={PaymentDate}
                                            onSelect={(value) =>
                                                setPaymentDate(value)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="basis-[190px]">
                                <label htmlFor="" className="text-base">
                                    طريقة السداد
                                </label>
                                <Popover>
                                    <div className="overflow-hidden ">
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                size="sm"
                                                role="combobox"
                                                className={cn(
                                                    `w-full justify-center gap-1 h-[40px] border border-stone-300 font-bold text-base`
                                                )}
                                            >
                                                {Methods
                                                    ? Methods.find(
                                                          (unit) =>
                                                              unit.type ===
                                                              Method
                                                      )?.type
                                                    : "نوع السند"}
                                                <ChevronsUpDown className="  w-4 shrink-0 mr-auto opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                    </div>
                                    <PopoverContent className=" p-2  w-[190px] rounded-none border border-stone-300">
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
                                                                    type.type ===
                                                                    Method
                                                                        ? SetMethod(
                                                                              undefined
                                                                          )
                                                                        : SetMethod(
                                                                              type.type
                                                                          );
                                                                }}
                                                                className="text-md border-b w-full text-center font-bold"
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
                                            <FormLabel className="font-bold text-base">
                                                اسم العميل
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                " justify-between  font-bold text-lg border-stone-300",
                                                                !field.value &&
                                                                    "text-muted-foreground border  "
                                                            )}
                                                        >
                                                            {field.value
                                                                ? customers.find(
                                                                      (
                                                                          customer
                                                                      ) =>
                                                                          customer.id ===
                                                                          field.value
                                                                  )?.name
                                                                : "اختر اسم العميل"}
                                                            <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className=" p-0 w-[190px] rounded-none">
                                                    <Command className=" max-h-56 overflow-y-auto rounded-none">
                                                        <CommandInput
                                                            className="rounded-none"
                                                            placeholder="ابحث عن عميل "
                                                        />
                                                        <CommandEmpty>
                                                            لا يوجد عميل بهذا
                                                            الاسم
                                                        </CommandEmpty>
                                                        <CommandGroup className="overflow-y-auto h-full rounded-none p-0">
                                                            {customers.map(
                                                                (customer) => (
                                                                    <CommandItem
                                                                        className={`border-b border-stone-300 rounded-none flex justify-between  font-bold text-md `}
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
                                            <FormLabel className="font-bold text-base">
                                                القيمة
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="قم بإدخال سعر الصنف هنا"
                                                    {...field}
                                                    type="number"
                                                    className="text-center border border-stone-300"
                                                />
                                            </FormControl>
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
                                            <FormLabel className="font-bold">
                                                ملاحظات
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="mt-0 space-y-0 border border-stone-300"
                                                    placeholder="قم بإدخال الملاحظات هنا"
                                                    {...field}
                                                    type="text"
                                                />
                                            </FormControl>
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
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewPaymentModal;
