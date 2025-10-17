import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { AddNewOrgModal } from "@/components/modals/AddNewOrgModal";
import SessionWrapper from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { redirect, routing } from "@/i18n/routing";
import { Suspense } from "react";
import Loading from "@/app/[locale]/loading";

const enFont = Roboto_Condensed({ subsets: ["latin"], weight: ["400", "700"] });
const arFont = Vazirmatn({ subsets: ["arabic"], weight: "400" });

export const metadata: Metadata = {
  title: "Edara ™",
  description: "ERP system",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    redirect({
      href: "/",
      locale: routing.defaultLocale,
    });
  }
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${locale === "ar" ? arFont.className : enFont.className} w-full h-full `}>
        <Suspense fallback={<Loading />}>
          <NextIntlClientProvider messages={messages}>
            <SessionWrapper>
              <div className="flex  min-h-screen ">
                <AddNewOrgModal />
                <Toaster />
                {children}
              </div>
            </SessionWrapper>
          </NextIntlClientProvider>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  );
}
