"use client";

import React, { useState, useEffect } from "react";
import { TableUi as DataTable } from "@/components/table";
import {
  JournalTransactionsColumnDataT,
  JournalTransactionscolumns,
} from "@/app/[locale]/(dashboard)/[orgid]/journal_transactions/JournalTransactionsColumns";
import { getJournalTransactions } from "@/app/[locale]/(dashboard)/[orgid]/journal_transactions/journal-transactions-actions";
import { useParams, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

const JournalTransactionsPage = () => {
  const [data, setData] = useState<JournalTransactionsColumnDataT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const orgId = params.orgid as string;

  const t = useTranslations("JournalEntries");

  useEffect(() => {
    const fetchJournalTransactions = async () => {
      try {
        setLoading(true);
        const result = await getJournalTransactions(orgId);

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Unknown error occurred");
        }
      } catch (err) {
        console.error("Error fetching journal transactions:", err);
        setError("Failed to fetch journal transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchJournalTransactions();
  }, [orgId]);

  const handleRefresh = () => {
    if (orgId) {
      setLoading(true);
      setError(null);
      getJournalTransactions(orgId).then((result) => {
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || "Unknown error occurred");
        }
        setLoading(false);
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-lg">{t("loadingJournalTransactions")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <Button onClick={handleRefresh} className="flex items-center">
          <RotateCcw className="h-4 w-4 me-2" />
          {t("refresh")}
        </Button>
      </div>
    );
  }
  console.log("data", data);

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("journalTransactions")}</h1>
          <p className="text-gray-600">{t("journalTransactionsDescription")}</p>
        </div>
        <Button onClick={handleRefresh} className="flex items-center">
          <RotateCcw className="h-4 w-4 me-2" />
          {t("refresh")}
        </Button>
      </div>

      <DataTable
        columns={JournalTransactionscolumns}
        data={data}
        filterEnabled={true}
        filterAccessorKey="accountName"
        filterplaceholder={t("filterByAccount")}
        pagination={true}
      />
    </div>
  );
};

export default JournalTransactionsPage;
