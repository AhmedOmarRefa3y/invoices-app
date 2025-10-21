// src/hooks/useJournalTransactions.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getJournalTransactions,
  getJournalTransactionsByAccount,
} from "@/lib/actions/journal-transactions-actions";
import { getLedgerAccounts } from "@/actions/ledgerAccounts";

export function useJournalTransactions(orgId?: string) {
  const [data, setData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts
  useEffect(() => {
    if (!orgId) return;

    const fetchAccounts = async () => {
      try {
        const res = await getLedgerAccounts(orgId);
        setAccounts(
          res.data!.map((acc) => ({
            id: acc.id,
            name: acc.name,
            code: acc.code,
          }))
        );
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("Failed to fetch accounts");
      }
    };

    fetchAccounts();
  }, [orgId]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!orgId) return;

    try {
      setLoading(true);
      setError(null);

      let result;
      if (selectedAccount) {
        result = await getJournalTransactionsByAccount(orgId, selectedAccount);
      } else {
        result = await getJournalTransactions(orgId);
      }

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Unknown error occurred");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch journal transactions");
    } finally {
      setLoading(false);
    }
  }, [orgId, selectedAccount]);

  // Fetch on mount and when account changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    data,
    accounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    error,
    handleRefresh,
  };
}
