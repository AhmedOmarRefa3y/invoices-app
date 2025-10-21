"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useLocale } from "next-intl";

interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName: string;
  accountCode?: string;
  description: string;
  debit: number;
  credit: number;
  currency?: string;
  reference?: string | null;
}

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  journalEntry: {
    id: string;
    number: number;
    date: Date | string;  // Date might come as a string from API
    description?: string | null;
    reference?: string | null;
    lines: JournalEntryLine[];
  } | null;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  journalEntry,
}) => {
  const t = useTranslations("JournalEntries");
  const locale = useLocale();

  if (!journalEntry) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("journalEntry")} #{journalEntry.number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">{t("date")}</h3>
              <p>
                {format(new Date(journalEntry.date), "dd/MM/yyyy", {
                  locale: locale === "ar" ? ar : undefined,
                })}
              </p>
            </div>
            <div>
              <h3 className="font-semibold">{t("reference")}</h3>
              <p>{journalEntry.reference || "-"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold">{t("description")}</h3>
            <p>{journalEntry.description || "-"}</p>
          </div>
          
          <div className="mt-4">
            <h3 className="font-semibold">{t("journalLines")}</h3>
            <div className="border rounded-md mt-2">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border">{t("account")}</th>
                    <th className="text-left p-2 border">{t("description")}</th>
                    <th className="text-right p-2 border">{t("debit")}</th>
                    <th className="text-right p-2 border">{t("credit")}</th>
                    <th className="text-left p-2 border">{t("reference")}</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntry.lines.map((line, index) => (
                    <tr key={line.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                      <td className="p-2 border">
                        {line.accountCode} - {line.accountName}
                      </td>
                      <td className="p-2 border">{line.description}</td>
                      <td className="p-2 border text-right">
                        {line.debit > 0 ? line.debit.toLocaleString() : ""}
                      </td>
                      <td className="p-2 border text-right">
                        {line.credit > 0 ? line.credit.toLocaleString() : ""}
                      </td>
                      <td className="p-2 border">{line.reference || ""}</td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-200">
                    <td colSpan={2} className="p-2 border text-right">
                      {t("total")}
                    </td>
                    <td className="p-2 border text-right">
                      {journalEntry.lines.reduce((sum, line) => sum + line.debit, 0).toLocaleString()}
                    </td>
                    <td className="p-2 border text-right">
                      {journalEntry.lines.reduce((sum, line) => sum + line.credit, 0).toLocaleString()}
                    </td>
                    <td className="p-2 border"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryModal;