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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CommandList } from "cmdk";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { CreateJournalEntry, EditJournalEntry } from "@/actions/journalEntries";
import { useParams, useRouter } from "next/navigation";
import useModals from "@/lib/zustand/useModals";
import { JournalEntryForEdit } from "@/lib/types";
import { useTranslations } from "next-intl";
import { LedgerAccount } from "@prisma/client";
import { getLedgerAccounts } from "@/actions/ledgerAccounts";

const formSchema = z.object({
  date: z.date(),
  description: z.string().optional(),
  lines: z
    .array(
      z.object({
        accountId: z.string().min(1, { message: "Account is required" }),
        description: z.string().optional(),
        debit: z.number().min(0, { message: "Amount must be positive" }),
        credit: z.number().min(0, { message: "Amount must be positive" }),
        currency: z.string().optional(),
        reference: z.string().optional(),
      })
    )
    .min(1, { message: "At least one line is required" }),
});

const AddNewJournalEntryModal = () => {
  const t = useTranslations("JournalEntries");
  const tCommon = useTranslations("common");
  const params: { orgid: string } = useParams();
  const ModalsStore = useModals();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const {
    AddJournalEntryModalIsOpen,
    SetAddJournalEntryModalIsOpen,
    JournalEntryToBeEdited,
    clearJournalEntryToBeEdited,
  } = ModalsStore;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: JournalEntryToBeEdited ? new Date(JournalEntryToBeEdited.date) : new Date(),
      description: JournalEntryToBeEdited?.description || "",
      lines: JournalEntryToBeEdited?.lines?.map((line) => ({
        accountId: line.accountId,
        description: line.description || "",
        debit: Number(line.debit),
        credit: Number(line.credit),
        currency: line.currency || "USD",
        reference: line.reference || "",
      })) || [
        { accountId: "", description: "", debit: 0, credit: 0, currency: "EGP", reference: "" },
        { accountId: "", description: "", debit: 0, credit: 0, currency: "EGP", reference: "" },
      ],
    },
  });
  const lines = useWatch({
    control: form.control,
    name: "lines",
  });

  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

  const mode = JournalEntryToBeEdited ? "edit" : "create";
  const headerName = mode === "edit" ? t("edit_journal_entry") : t("add_journal_entry");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getLedgerAccounts(params.orgid);
        if (response.data) {
          setAccounts(response.data);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, [params.orgid]);

  // Watch total debit and credit amounts to check balance

  useEffect(() => {
    if (!lines || lines.length === 0) {
      setBalanceError(null);
      return;
    }

    if (totalDebit !== totalCredit) {
      setBalanceError(
        `${t("total_debit")}: ${totalDebit.toFixed(2)} ≠ ${t(
          "total_credit"
        )}: ${totalCredit.toFixed(2)}`
      );
    } else {
      setBalanceError(null);
    }
  }, [lines]);

  const addNewLine = () => {
    const currentLines = form.getValues("lines") || [];
    const newLine = {
      accountId: "",
      description: "",
      debit: 0,
      credit: 0,
      currency: "ُEGP",
      reference: "",
    };
    form.setValue("lines", [...currentLines, newLine]);
  };

  const removeLine = (index: number) => {
    const currentLines = form.getValues("lines");
    if (currentLines.length <= 1) {
      toast.error(t("at_least_one_line_required"));
      return;
    }

    const updatedLines = currentLines.filter((_, i) => i !== index);
    form.setValue("lines", updatedLines);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (totalDebit !== totalCredit) {
      toast.error(t("debits_must_equal_credits"));
      setLoading(false);
      return;
    }

    const JournalEntryInfo = {
      ...values,
      orgid: params.orgid,
      journalEntryId: JournalEntryToBeEdited?.id,
    };

    if (!JournalEntryToBeEdited) {
      const CreateNewJournalEntry = await CreateJournalEntry(JournalEntryInfo);
      if (CreateNewJournalEntry.status === "ok") {
        toast.success(t("journal_entry_added"));
        SetAddJournalEntryModalIsOpen(false);
        form.reset();
        clearJournalEntryToBeEdited();
        router.refresh();
      } else {
        toast.error(CreateNewJournalEntry.message);
      }
    } else {
      const UpdateExistingJournalEntry = await EditJournalEntry(JournalEntryInfo);
      if (UpdateExistingJournalEntry.status === "ok") {
        toast.success(t("journal_entry_updated"));
        SetAddJournalEntryModalIsOpen(false);
        form.reset();
        clearJournalEntryToBeEdited();
        router.refresh();
      } else {
        toast.error(UpdateExistingJournalEntry.message);
      }
    }

    setLoading(false);
  }

  const closeModal = () => {
    SetAddJournalEntryModalIsOpen(false);
    clearJournalEntryToBeEdited();
  };

  return (
    <Dialog open={AddJournalEntryModalIsOpen} onOpenChange={closeModal}>
      <DialogContent className=" w-[98%] transition-all max-w-4xl border border-stone-300 bg-white p-2 z-[100]">
        <DialogHeader className="flex items-center mt-2">
          <DialogTitle>{headerName}</DialogTitle>
        </DialogHeader>
        <div className="py-4 rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-bold">{tCommon("date")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-bold border border-stone-300",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>{tCommon("select")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">{t("description")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("description_placeholder")}
                            {...field}
                            className="text-center border border-stone-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <FormLabel className="font-bold">{t("journal_lines")}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewLine}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t("add_line")}
                  </Button>
                </div>

                {balanceError && <div className="text-red-500 text-sm mb-2">{balanceError}</div>}

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-start text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("account")}
                        </th>
                        <th className="p-2 text-start text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("description")}
                        </th>
                        <th className="p-2 text-start text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("debit")}
                        </th>
                        <th className="p-2 text-start text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("credit")}
                        </th>
                        <th className="p-2 text-start text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("reference")}
                        </th>
                        <th className="p-2 text-center text-md font-medium text-gray-500 uppercase tracking-wider">
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.watch("lines")?.map((line, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.accountId`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          role="combobox"
                                          className={cn(
                                            "w-[200px] justify-between text-center font-bold border-stone-300 text-sm",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value
                                            ? accounts.find((account) => account.id === field.value)
                                                ?.name
                                            : tCommon("select")}
                                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0">
                                      <Command>
                                        <CommandInput placeholder={tCommon("search")} />
                                        <CommandEmpty>{tCommon("no_results")}</CommandEmpty>
                                        <CommandList>
                                          <CommandGroup>
                                            {accounts
                                              .filter((account) => account.isLeaf) // Only show leaf accounts
                                              .map((account) => (
                                                <CommandItem
                                                  value={account.name}
                                                  key={account.id}
                                                  onSelect={() => {
                                                    field.onChange(account.id);
                                                  }}
                                                >
                                                  <Check
                                                    className={cn(
                                                      "mr-2 h-4 w-4",
                                                      account.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    )}
                                                  />
                                                  {account.code} - {account.name}
                                                </CommandItem>
                                              ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={t("description_placeholder")}
                                      {...field}
                                      className="text-center text-sm border border-stone-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.debit`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="0.00"
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseFloat(e.target.value) || 0)
                                      }
                                      className="text-right text-sm border border-stone-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.credit`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="0.00"
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseFloat(e.target.value) || 0)
                                      }
                                      className="text-right text-sm border border-stone-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name={`lines.${index}.reference`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={t("reference_placeholder")}
                                      {...field}
                                      className="text-center text-sm border border-stone-300"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeLine(index)}
                              disabled={loading || form.watch("lines").length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={closeModal} disabled={loading}>
                  {tCommon("cancel")}
                </Button>
                <Button type="submit" disabled={loading || !!balanceError}>
                  {loading ? tCommon("loading") : tCommon("save")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewJournalEntryModal;
