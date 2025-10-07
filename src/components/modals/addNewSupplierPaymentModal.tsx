"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { CreateSupplierPayment } from "@/actions/payments";
import { useParams } from "next/navigation";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";
import { Customer } from "@prisma/client";
import { getCustomers } from "@/actions/customers";

const formSchema = z.object({
  SupplierId: z.string().min(1, {
    message: "Supplier ID is required.",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount is required and must be greater than 0",
  }),
  Note: z.string().optional(),
});

const AddNewSupplierPaymentModal = () => {
  const t = useTranslations("addNewPaymentModal");
  const tCommon = useTranslations("common");
  const params: { orgid: string } = useParams();
  const ModalsStore = useModals();
  const [loading, setLoading] = useState(false);
  const [Method, SetMethod] = useState<undefined | string>(undefined);
  const [PaymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [suppliers, setSuppliers] = useState<Customer[] | []>([]);

  const Methods = [
    { id: 1, type: t("cash") },
    { id: 2, type: t("bank_transfer") },
    { id: 3, type: t("cheque") },
    { id: 4, type: t("credit") },
  ];

  const { AddSupplierPaymentModalIsOpen, SetAddSupplierPaymentModalIsOpen } = ModalsStore;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      SupplierId: "",
      Note: "",
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const Data = await getCustomers(params.orgid);
        if (Data.data) {
          // Filter only suppliers
          const supplierData = Data.data.filter((customer) => customer.IsASupplier === true);
          setSuppliers(supplierData);
          return;
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, [params.orgid]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    if (PaymentDate?.getHours() === 0) {
      PaymentDate.setHours(22);
    }
    const PaymentInfo = {
      ...values,
      SupplierId: values.SupplierId,
      PaymentDate: PaymentDate,
      Method: Method || "",
      orgid: params.orgid,
    };

    const CreateNewSupplierPayment = await CreateSupplierPayment(PaymentInfo);
    if (CreateNewSupplierPayment.status === "ok") {
      toast.success(t("supplier_payment_added"));
      SetAddSupplierPaymentModalIsOpen(false);
      form.reset();
      SetMethod(undefined);
    } else {
      toast.error(CreateNewSupplierPayment.message);
    }
    setLoading(false);
  }

  const closeModal = () => {
    SetAddSupplierPaymentModalIsOpen(false);
  };

  return (
    <Dialog open={AddSupplierPaymentModalIsOpen} onOpenChange={closeModal}>
      <DialogContent className="md:w-fit w-[98%] transition-all shadow-2xl border border-stone-300 bg-white p-2 z-[100]">
        <DialogHeader className="flex items-center mt-2">
          <DialogTitle>{t("add_supplier_payment")}</DialogTitle>
        </DialogHeader>
        <div className="py-4 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:w-[400px] gap-2 items-end"
            >
              <div className="w-full">
                <Popover>
                  <div className="flex flex-col">
                    <label>{tCommon("date")}</label>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full flex justify-between text-left font-bold border border-stone-300",
                          !Date && "text-muted-foreground"
                        )}
                      >
                        {PaymentDate ? (
                          format(new Date(PaymentDate), "PPP")
                        ) : (
                          <span>{tCommon("select")}</span>
                        )}
                        <CalendarIcon className="mr-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent className="p-0" matchTriggerWidth={false}>
                    <Calendar
                      mode="single"
                      selected={PaymentDate}
                      onSelect={(value) => setPaymentDate(value)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="basis-[190px]">
                <label className="text-base">{t("method")}</label>
                <Popover>
                  <div className="overflow-hidden">
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
                          ? Methods.find((unit) => unit.type === Method)?.type
                          : t("payment_method")}
                        <ChevronsUpDown className="w-4 shrink-0 mr-auto opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </div>
                  <PopoverContent
                    className="p-2 w-[190px]  border border-stone-300"
                    matchTriggerWidth
                  >
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {Methods.map((type) => (
                            <div className="flex justify-between items-center" key={type.id}>
                              <CommandItem
                                key={type.id}
                                onSelect={() => {
                                  SetMethod(type.type === Method ? undefined : type.type);
                                }}
                                className="text-md border-b w-full text-center font-bold"
                              >
                                <span className="w-full">{type.type}</span>
                                <Check
                                  className={cn(
                                    "mr-auto w-4",
                                    Method === type.type ? "opacity-100" : "opacity-0"
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
                  name="SupplierId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-bold text-base">{t("supplier_name")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between font-bold text-lg border-stone-300",
                                !field.value && "text-muted-foreground border"
                              )}
                            >
                              {field.value
                                ? suppliers.find((supplier) => supplier.id === field.value)?.name
                                : tCommon("select")}
                              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[190px] rounded-none">
                          <Command className="max-h-56 overflow-y-auto rounded-none">
                            <CommandInput
                              className="rounded-none"
                              placeholder={tCommon("search")}
                            />
                            <CommandEmpty>{tCommon("no_results")}</CommandEmpty>
                            <CommandGroup className="overflow-y-auto h-full rounded-none p-0">
                              {suppliers.map((supplier) => (
                                <CommandItem
                                  className={`border-b border-stone-300 rounded-none flex justify-between font-bold text-md`}
                                  value={supplier.name}
                                  key={supplier.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "SupplierId",
                                      form.getValues("SupplierId") === supplier.id
                                        ? ""
                                        : supplier.id
                                    );
                                  }}
                                >
                                  {supplier.name}
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      supplier.id === field.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
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
                      <FormLabel className="font-bold text-base">{t("amount")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("amount")}
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
                      <FormLabel className="font-bold">{t("notes")}</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-0 space-y-0 border border-stone-300"
                          placeholder={t("notes")}
                          {...field}
                          type="text"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="basis-[190px]" disabled={loading}>
                {tCommon("save")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSupplierPaymentModal;
