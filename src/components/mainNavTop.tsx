"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MainNavTop = ({
    orgName,
    userName,
}: {
    userName: string | null | undefined;
    orgName: string;
}) => {
    const pathName = usePathname();
    const parts = pathName.split("/");

    const paths: any = {
        "add-sales-invoice": "اضافة فاتورة مبيعات",
        "add-returns-invoice": "اضافة فاتورة مرتجعات",
        "production-orders": "امر انتاج",
        "production-plans": "خطة انتاج",
        "accounts-reports": "حسابات العملاء",
        "customer-credit": "كشف حساب عميل",
        invoices: "الفواتير",
        "composed-items": "الاصناف المجمعة",
        "initial-quantities": "اول المدة",
        "product-records": "حركة صنف",
        Payments: "مدفوعات العملاء",
        returnedInvoices: "فواتير المرتجعات",
        showREtInvoice: "عرض فاتورة مرتجعات",
        sales: "فواتير المبيعات",
        releaseorder: "اذن تحميل",
        showInvoice: "عرض فاتورة",
        inventory: "المخزون",
    };
    return (
        <div className=" flex items-center sticky top-0 left-0 right-0 w-full  justify-end py-2 text-lg font-bold text-black bg-[#ffffff] duration-300 px-4 h-[50px]  border-b border-b-stone-300 mx-auto z-50">
            <div className="ml-auto">
                <Link href={`/${parts[1]}`}>الرئيسية</Link>
                {paths[parts[2]] ? <span className="mx-2">/</span> : null}
                {pathName === `/${parts[1]}/${parts[2]}` ? (
                    <span> {paths[parts[2]]}</span>
                ) : (
                    <Link href={`/${parts[1]}/${parts[2]}`}>
                        {paths[parts[2]]}
                    </Link>
                )}
                {paths[parts[3]] ? <span className="mx-2">/</span> : null}
                {pathName === `/${parts[1]}/${parts[2]}/${parts[3]}` ? (
                    <span> {paths[parts[3]]}</span>
                ) : (
                    <Link href={`/${parts[1]}/${parts[2]}/${parts[3]}`}>
                        {paths[parts[3]]}
                    </Link>
                )}
                {paths[parts[4]] ? <span className="mx-2">/</span> : null}
                {pathName ===
                `/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}` ? (
                    <span> {paths[parts[4]]}</span>
                ) : (
                    <Link
                        href={`/${parts[1]}/${parts[2]}/${parts[3]}/${parts[4]}`}
                    >
                        {paths[parts[4]]}
                    </Link>
                )}
            </div>
            <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col text-sm items-end justify-center font-light">
                    <span>{userName}</span>
                    <span>{orgName}</span>
                </div>
                <span
                    onClick={() => signOut()}
                    className="text-slate-900 duration-300 hover:bg-[#f5f4f4] p-1 rounded-sm hover:text-emerald-500 "
                >
                    <LogOut size={25} />
                </span>
            </div>
        </div>
    );
};

export default MainNavTop;
