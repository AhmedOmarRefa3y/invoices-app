import Link from "next/link";
import React from "react";
import { ModeToggle } from "./toogleDarkMode";

const MainNav = () => {
    return (
        <div>
            <div className=" z-20 relative  navbar  bg-slate-600 rounded-md gap-2 hidden md:flex">
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
                <div className="mr-auto">
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};

export default MainNav;
