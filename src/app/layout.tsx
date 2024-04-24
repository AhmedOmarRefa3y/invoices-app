import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

import { AddNewOrgModal } from "@/components/modals/AddNewOrgModal";
import { CharkaWrapper } from "@/components/providers/CharkaWrapper";
import SessionWrapper from "@/components/providers/AuthProvider";

const inter = Vazirmatn({ subsets: ["arabic"], weight: "400" });

export const metadata: Metadata = {
    title: "ُEdara Erp",
    description: "ERP system",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl" className="light">
            <body className={`${inter.className} w-full h-full `}>
                <SessionWrapper>
                    <CharkaWrapper>
                        <div className="flex items-center justify-center h-screen">
                            <AddNewOrgModal />
                            {children}
                        </div>
                    </CharkaWrapper>
                </SessionWrapper>
            </body>
        </html>
    );
}
