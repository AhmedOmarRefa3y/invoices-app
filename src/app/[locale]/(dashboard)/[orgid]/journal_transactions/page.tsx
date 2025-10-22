"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader, RotateCcw } from "lucide-react";
import { TableUi as DataTable } from "@/components/table";
import { JournalTransactionscolumns } from "@/app/[locale]/(dashboard)/[orgid]/journal_transactions/JournalTransactionsColumns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useJournalTransactions } from "@/app/[locale]/(dashboard)/[orgid]/journal_transactions/useJournalTransactions";

const JournalTransactionsPage = () => {
  const t = useTranslations("JournalEntries");
  const { data, accounts, selectedAccount, handleAccountChange, loading, error, handleRefresh } =
    useJournalTransactions();

  if (error)
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <Button onClick={handleRefresh} className="flex items-center">
          <RotateCcw className="h-4 w-4 me-2" />
          {t("refresh")}
        </Button>
      </div>
    );

  return (
    <div className="p-4 ">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("journalTransactions")}</h1>
          <p className="text-gray-600">{t("journalTransactionsDescription")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedAccount} onValueChange={handleAccountChange}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder={t("selectAccount")} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.code} value={account.code}>
                  {account.code} - {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} className="flex items-center whitespace-nowrap">
            <RotateCcw className="h-4 w-4 me-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm  z-50 rounded-lg">
            <Loader className="animate-spin" />
          </div>
        )}
        <DataTable
          columns={JournalTransactionscolumns}
          data={data}
          filterEnabled
          filterAccessorKey="reference"
          filterplaceholder={t("filterByReference")}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default JournalTransactionsPage;
