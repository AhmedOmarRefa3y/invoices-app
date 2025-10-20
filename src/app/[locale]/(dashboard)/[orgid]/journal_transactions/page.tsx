"use client";

import React, { useState, useEffect } from "react";
import { TableUi as DataTable } from "@/components/table";
import {
  JournalTransactionsColumnDataT,
  JournalTransactionscolumns,
} from "@/app/[locale]/(dashboard)/[orgid]/journal_transactions/JournalTransactionsColumns";
import { getJournalTransactions, getJournalTransactionsByAccount } from "@/lib/actions/journal-transactions-actions";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import prismaDb from "@/lib/prisma";

const JournalTransactionsPage = () => {
  const [data, setData] = useState<JournalTransactionsColumnDataT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([]);
  const params = useParams();
  const orgId = params.orgid as string;

  const t = useTranslations("JournalEntries");

  // Fetch accounts for the organization
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const orgAccounts = await prismaDb.ledgerAccount.findMany({
          where: {
            organizationId: orgId,
          },
          select: {
            id: true,
            name: true,
            code: true,
          },
          orderBy: {
            code: "asc",
          },
        });
        setAccounts(orgAccounts);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to fetch accounts");
      }
    };

    if (orgId) {
      fetchAccounts();
    }
  }, [orgId]);

  // Fetch transactions when account selection changes
  useEffect(() => {
    const fetchJournalTransactions = async () => {
      try {
        setLoading(true);
        let result;

        if (selectedAccount) {
          // Fetch transactions for specific account
          result = await getJournalTransactionsByAccount(orgId, selectedAccount);
        } else {
          // Fetch all transactions if no account selected
          result = await getJournalTransactions(orgId);
        }
        
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

    if (orgId) {
      fetchJournalTransactions();
    }
  }, [orgId, selectedAccount]);

  const handleRefresh = () => {
    if (orgId) {
      setLoading(true);
      setError(null);
      
      // Fetch based on selected account
      if (selectedAccount) {
        getJournalTransactionsByAccount(orgId, selectedAccount).then(result => {
          if (result.success) {
            setData(result.data);
          } else {
            setError(result.error || "Unknown error occurred");
          }
          setLoading(false);
        });
      } else {
        getJournalTransactions(orgId).then(result => {
          if (result.success) {
            setData(result.data);
          } else {
            setError(result.error || "Unknown error occurred");
          }
          setLoading(false);
        });
      }
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
  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("journalTransactions")}</h1>
          <p className="text-gray-600">{t("journalTransactionsDescription")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder={t("selectAccount")} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleRefresh} className="flex items-center whitespace-nowrap">
            <RotateCcw className="h-4 w-4 me-2" />
            {t("refresh")}
          </Button>
        </div>
      </div>

      <DataTable
        columns={JournalTransactionscolumns}
        data={data}
        filterEnabled={true}
        filterAccessorKey="reference"
        filterplaceholder={t("filterByReference")}
        pagination={true}
      />
    </div>
  );
};

export default JournalTransactionsPage;
