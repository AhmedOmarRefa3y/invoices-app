// src/hooks/useJournalTransactions.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getJournalTransactions } from "@/lib/actions/journal-transactions-actions";
import { getLedgerAccounts } from "@/actions/ledgerAccounts";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

export function useJournalTransactions() {
  const params = useParams();
  const orgId = params.orgid as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const accountFromUrl = searchParams.get("account"); // 👈 Get account from query param
  const [data, setData] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<{ id: string; name: string; code: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>(accountFromUrl || "");
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
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
        result = await getJournalTransactions(orgId, selectedAccount);
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

  const handleAccountChange = useCallback(
    (value: string) => {
      setSelectedAccount(value);

      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("account", value);
      } else {
        params.delete("account");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams, setSelectedAccount]
  );
  return {
    data,
    accounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    error,
    handleRefresh,
    handleAccountChange,
  };
}
