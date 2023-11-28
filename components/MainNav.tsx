import Link from "next/link";
import React from "react";
import { ModeToggle } from "./toogleDarkMode";
import ProductionEvent from "./ProductionEvent";
import prismaDb from "@/lib/prisma";

const MainNav = async () => {
    const products = await prismaDb.product.findMany();

    return (
        <div>
            <div className=" z-20 relative  navbar items-center justify-center  bg-slate-600 rounded-md gap-2 hidden md:flex">
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
                <Link
                    href={"/Payments"}
                    className="btn btn-primary normal-case text-xl rounded-md"
                >
                    المدفوعات
                </Link>
                <Link
                    href={"/inventory"}
                    className="btn btn-primary normal-case text-xl rounded-md"
                >
                    المخزن
                </Link>
                <ProductionEvent products={products} />
                <div className="mr-auto">
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
};

export default MainNav;
