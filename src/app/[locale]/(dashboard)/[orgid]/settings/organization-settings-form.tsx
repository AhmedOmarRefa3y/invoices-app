"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { organization } from "@prisma/client";
import { toast } from "react-hot-toast";
import { updateOrganizationName } from "./actions";

interface OrganizationSettingsFormProps {
  organization: organization;
  locale: string;
}

export default function OrganizationSettingsForm({
  organization,
  locale,
}: OrganizationSettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(organization.name);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Format the date on the client side to avoid hydration errors
    const formattedDate = new Date(organization.createdAt).toLocaleDateString(
      locale === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    setCreatedAt(formattedDate);
  }, [locale, organization.createdAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateOrganizationName(organization.id, name);

      if (!result.success) {
        throw new Error(
          result.error ||
            (locale === "ar" ? "فشل في تحديث اسم المنشأة" : "Failed to update organization name")
        );
      }

      toast.success(
        locale === "ar" ? "تم تحديث اسم المنشأة بنجاح" : "Organization name updated successfully"
      );
      router.refresh();
    } catch (err) {
      console.error("Error updating organization:", err);
      setError(
        err instanceof Error
          ? err.message
          : locale === "ar"
          ? "حدث خطأ غير متوقع"
          : "An unexpected error occurred"
      );
      toast.error(
        error ||
          (locale === "ar" ? "فشل في تحديث اسم المنشأة" : "Failed to update organization name")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-lg font-medium text-gray-900">
          {locale === "ar" ? "معلومات المنشأة" : "Organization Information"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="org-name" className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "ar" ? "اسم المنشأة" : "Organization Name"}
          </label>
          <input
            type="text"
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "ar" ? "معرف المنشأة" : "Organization ID"}
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
            {organization.id}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {locale === "ar" ? "تاريخ الإنشاء" : "Created At"}
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
            {createdAt || "Loading..."}
          </div>
        </div>

        {error && <div className="text-red-500 text-sm py-2">{error}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || name === organization.name}
            className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading || name === organization.name
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {locale === "ar" ? "جارٍ التحديث..." : "Updating..."}
              </span>
            ) : locale === "ar" ? (
              "تحديث الاسم"
            ) : (
              "Update Name"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
