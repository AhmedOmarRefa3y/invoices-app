"use client";

import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus, Building } from "lucide-react";
import useModals from "@/lib/zustand/useModals";
import { organization } from "@prisma/client";
import { useTranslations } from "next-intl";

export function OrgSelector({ organizations }: { organizations: organization[] }) {
  const router = useRouter();
  const Modals = useModals();
  const t = useTranslations("orgSelector");

  const handleSelectOrg = (orgId: string) => {
    router.push(`/${orgId}`);
  };

  const handleCreateNewOrg = () => {
    Modals.setAddOrgModalIsOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("select_organization")}</h1>
          <p className="mt-2 text-gray-600">{t("choose_organization_or_create_new")}</p>
        </div>

        <div className="space-y-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSelectOrg(org.id)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{org.name}</h3>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleCreateNewOrg}
          className="w-full flex items-center gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          {t("create_new_organization")}
        </Button>
      </div>
    </div>
  );
}
