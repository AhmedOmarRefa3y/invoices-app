import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

import { AddNewOrgModal } from "@/components/modals/AddNewOrgModal";
import SessionWrapper from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Roboto_Condensed({ subsets: ["latin"], weight: ["400", "700"] });

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
        <html className="light">
            <body className={`${inter.className} w-full h-full `}>
                <SessionWrapper>
                    <div className="flex items-center justify-center h-screen">
                        <AddNewOrgModal />
                        <Toaster />
                        {children}
                    </div>
                </SessionWrapper>
            </body>
        </html>
    );
}
