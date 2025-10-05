"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createAccount, updateAccount } from "../actions";
import { LedgerAccount } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface AccountFormModalProps {
  orgid: string;
  account?: LedgerAccount;
  parentId?: string | null;
  onSuccess: () => void;
}

const AccountFormModal = ({ orgid, account, parentId, onSuccess }: AccountFormModalProps) => {
  const t = useTranslations("ChartOfAccounts");
  const [formData, setFormData] = useState({
    code: account?.code || "",
    name: account?.name || "",
    type: account?.type || "ASSET",
    normalSide: account?.normalSide || "DEBIT",
    parentId: account?.parentId || parentId || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountTypes = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];
  const balanceSides = ["DEBIT", "CREDIT"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (account) {
        // Update existing account
        // await updateAccount(account.id, {
        //   ...formData,
        //   organizationId: orgid,
        // });
        // toast.success(t("accountUpdated"));
      } else {
        // Create new account
        await createAccount({
          ...formData,
          organizationId: orgid,
        });
        toast.success(t("accountCreated"));
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving account:", error);
      toast.error(t("saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">{t("accountCode")}</Label>
        <Input
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
          placeholder={t("accountCodePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("accountName")}</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder={t("accountNamePlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">{t("accountType")}</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {t(type.toLowerCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="normalSide">{t("normalSide")}</Label>
        <Select
          value={formData.normalSide}
          onValueChange={(value) => handleSelectChange("normalSide", value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {balanceSides.map((side) => (
              <SelectItem key={side} value={side}>
                {t(side.toLowerCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onSuccess}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : account ? t("updateAccount") : t("createAccount")}
        </Button>
      </div>
    </form>
  );
};

export default AccountFormModal;
