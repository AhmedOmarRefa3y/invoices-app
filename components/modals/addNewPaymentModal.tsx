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
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Customer } from "@prisma/client";
import { Check, ChevronsUpDown, Table } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
    CustomerId: z.string().min(2, {
        message: "CustomerId must be at least 5 characters.",
    }),
    amount: z.coerce.number().min(1),
});

interface addNewPaymentModalProps {
    customers: Customer[];
}

const AddNewPaymentModal: React.FC<addNewPaymentModalProps> = ({
    customers,
}) => {
    const invoice = useInvoice();
    const [lodaing, setlodaing] = useState(false);

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
        // console.log("Form submitted!", values);
        setlodaing(true);

        let PaymentInfo = { ...values, PaymentId: PaymentToBeEdited?.id };

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

    return (
        <Dialog
            open={AddPaymentModalIsOpen}
            onOpenChange={SetAddPaymentModalIsOpen}
        >
            <DialogContent className="sm:max-w-md transition-all shadow-lg ">
                <DialogHeader className="flex items-center">
                    <DialogTitle>{headerName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 flex items-center justify-center flex-col text-center"
                    >
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
                                                        "w-[200px] justify-between",
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
                                                                {customer.name}
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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={lodaing}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewPaymentModal;
