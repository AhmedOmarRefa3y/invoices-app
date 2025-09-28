"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useModals from "@/lib/zustand/useModals";
import { organization } from "@prisma/client";
import { useTranslations } from "next-intl";

interface OrgSwitcherProps {
  organizations: organization[];
  currentOrgId: string;
}

export function OrgSwitcher({ organizations, currentOrgId }: OrgSwitcherProps) {
  const t = useTranslations("orgSwitcher");
  const router = useRouter();
  const Modals = useModals();
  const [currentOrg, setCurrentOrg] = useState<organization | undefined>(
    organizations.find((org) => org.id === currentOrgId)
  );

  useEffect(() => {
    setCurrentOrg(organizations.find((org) => org.id === currentOrgId));
  }, [currentOrgId, organizations]);

  const handleOrgChange = (orgId: string) => {
    router.push(`/${orgId}`);
  };

  const handleCreateNewOrg = () => {
    Modals.setAddOrgModalIsOpen(true);
  };

  if (!currentOrg) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="font-medium truncate max-w-[120px]">{currentOrg.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="p-2 text-sm font-medium text-muted-foreground">{t("organizations")}</div>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleOrgChange(org.id)}
              className={org.id === currentOrgId ? "bg-muted" : ""}
            >
              <span className="truncate">{org.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={handleCreateNewOrg} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>{t("create_new_organization")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
