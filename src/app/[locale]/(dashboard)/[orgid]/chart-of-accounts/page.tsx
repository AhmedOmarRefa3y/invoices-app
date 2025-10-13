"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Folder, FolderOpen, ChevronRight, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AccountFormModal from "./components/AccountFormModal";
import { getAccountsTree, deleteAccount } from "./actions";
import useModals from "@/lib/zustand/useModals";

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";
  normalSide: "DEBIT" | "CREDIT";
  parentId: string | null;
  children: LedgerAccount[];
  isLeaf: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChartOfAccountsPage = ({ params }: { params: { orgid: string } }) => {
  const { orgid } = params;
  const t = useTranslations("ChartOfAccounts");
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const ModalsStore = useModals();
  const { refreshChartOfAccounts } = ModalsStore;

  useEffect(() => {
    fetchAccounts();
    console.log("UseEffect triggered");
  }, [orgid, refreshTrigger, refreshChartOfAccounts]);

  console.log("chart of accounts render");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getAccountsTree(orgid);
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddAccount = (parentId: string | null = null) => {};

  const handleEditAccount = (account: LedgerAccount) => {};

  const handleDeleteAccount = async (id: string) => {
    if (confirm(t("confirmDelete"))) {
      try {
        await deleteAccount(id);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert(t("deleteError"));
      }
    }
  };

  const renderTree = (accounts: LedgerAccount[], level = 0) => {
    return accounts.map((account) => (
      <div key={account.id} className="ms-4">
        <div className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
          {account.children && account.children.length > 0 ? (
            <button
              onClick={() => toggleNode(account.id)}
              className="me-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {expandedNodes.has(account.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 me-2"></div>
          )}

          <div className="flex-1 flex items-center">
            <span className="me-2">
              {expandedNodes.has(account.id) ? <FolderOpen size={16} /> : <Folder size={16} />}
            </span>
            <span className="font-medium">
              {account.code} - {account.name}
            </span>
            <span className="ms-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
              {account.type}
            </span>
          </div>

          <div className="flex  gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEditAccount(account)}>
              {t("edit")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddAccount(account.id)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Plus size={14} className="me-1" /> {t("addChild")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteAccount(account.id)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {t("delete")}
            </Button>
          </div>
        </div>

        {account.children && account.children.length > 0 && expandedNodes.has(account.id) && (
          <div className="ms-4 border-s border-gray-200 dark:border-gray-700">
            {renderTree(
              account.children.sort((a, b) => Number(a.code) - Number(b.code)),
              level + 1
            )}{" "}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{t("chartOfAccounts")}</CardTitle>
          <Button onClick={() => handleAddAccount()}>
            <Plus className="me-2 h-4 w-4" />
            {t("addRootAccount")}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t("noAccounts")}</p>
              <Button className="mt-4" onClick={() => handleAddAccount()}>
                <Plus className="me-2 h-4 w-4" />
                {t("addFirstAccount")}
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">{renderTree(accounts)}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartOfAccountsPage;
