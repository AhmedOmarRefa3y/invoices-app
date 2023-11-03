import Link from "next/link";
import React from "react";

const MainNav = () => {
    return (
        <div className="navbar bg-slate-600 rounded-full gap-2">
            <Link href={"/"} className="btn btn-primary normal-case text-xl">
                Add Invoice
            </Link>
            <Link
                href={"/invoices"}
                className="btn btn-primary normal-case text-xl"
            >
                Show Invoices
            </Link>
        </div>
    );
};

export default MainNav;
