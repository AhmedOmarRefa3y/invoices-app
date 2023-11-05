import Link from "next/link";
import React from "react";

const MainNav = () => {
    return (
        <div className="navbar bg-slate-600 rounded-md gap-2">
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
                href={"/add/product"}
                className="btn btn-primary normal-case text-xl rounded-md"
            >
                اضافة صنف
            </Link>
            <Link
                href={"/add/customer"}
                className="btn btn-primary normal-case text-xl rounded-md"
            >
                اضافة عميل
            </Link>
        </div>
    );
};

export default MainNav;
