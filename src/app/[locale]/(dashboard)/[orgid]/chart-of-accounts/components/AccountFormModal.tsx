"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { createAccount, updateAccount } from "../actions";
import toast from "react-hot-toast";
import useModals from "@/lib/zustand/useModals";

export default function AccountFormModal() {
  const params = useParams<{ orgid: string; locale: string }>();
  const router = useRouter();
  const modalsStore = useModals();

  const {
    chartOfAccountsModalIsOpen,
    chartAccountData,
    setChartOfAccountsModalIsOpen,
    setChartAccountData,
    setRefreshChartOfAccounts,
  } = modalsStore;

  const isEditing = !!chartAccountData?.account;
  const parentId = chartAccountData?.parentId || null;

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    type: "ASSET" as "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE",
    normalSide: "DEBIT" as "DEBIT" | "CREDIT",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isEditing && chartAccountData?.account) {
      setFormData({
        id: chartAccountData.account.id,
        code: chartAccountData.account.code,
        name: chartAccountData.account.name,
        type: chartAccountData.account.type,
        normalSide: chartAccountData.account.normalSide,
      });
    } else {
      // Reset form for new account
      setFormData({
        id: "",
        code: "",
        name: "",
        type: "ASSET",
        normalSide: "DEBIT",
      });
    }
  }, [isEditing, chartAccountData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && chartAccountData?.account) {
        // Update existing account
        const result = await updateAccount(chartAccountData.account.id, {
          ...formData,
          parentId,
          organizationId: params.orgid,
        });

        toast.success("Account updated successfully");
        setRefreshChartOfAccounts(Date.now());
      } else {
        // Create new account
        const result = await createAccount({
          ...formData,
          parentId,
          organizationId: params.orgid,
        });

        toast.success("Account created successfully");
        setRefreshChartOfAccounts(Date.now());
      }

      // Close modal and refresh the page
      setChartOfAccountsModalIsOpen(false);
      setChartAccountData(null);
      router.refresh();
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error(isEditing ? "Failed to update account" : "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChartOfAccountsModalIsOpen(false);
    setChartAccountData(null);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-stone-300 shadow-lg border font-bold w-[98%]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{isEditing ? "Edit Account" : "Add New Account"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Account Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. 1000, 1000-01"
              // required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Cash, Accounts Receivable"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE") =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSET">Asset</SelectItem>
                  <SelectItem value="LIABILITY">Liability</SelectItem>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="normalSide">Normal Side</Label>
              <Select
                value={formData.normalSide}
                onValueChange={(value: "DEBIT" | "CREDIT") =>
                  setFormData({ ...formData, normalSide: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
