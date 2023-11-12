import Link from "next/link";
import React from "react";

const MainNav = () => {
    return (
        <div className="navbar bg-slate-600 rounded-md gap-2 hidden md:flex">
            <Link
                href={"/"}
                className="btn btn-primary normal-case text-xl rounded-md"
            >
                اضافة فاتورة
            </Link>
            <Link
                href={"/invoices"}
                className="btn btn-primary normal-case text-xl rounded-md"
            >
                عرض الفواتير
            </Link>
            <Link
                href={"/accountstatement"}
                className="btn btn-primary normal-case text-xl rounded-md"
            >
                كشف حساب عميل
            </Link>
        </div>
    );
};

export default MainNav;
