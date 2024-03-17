import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead>
            <tr className=" border-stone-300 border bg-[#fafafa] ">
                <th align="center" className="text-lg    w-[5%] ">
                    م
                </th>
                <th align="center" className="text-lg  w-[55%] border border-stone-300">
                    البيـــــــــــــــــان
                </th>
                <th align="center" className="text-lg  w-[10%] border border-stone-300">
                    الكمية
                </th>
                <th align="center" className="text-lg    w-[10%] border border-stone-300">
                    السعر
                </th>
                <th align="center" className="text-lg    w-[10%] border border-stone-300">
                    القيمة
                </th>
                <th align="center" className="text-lg   w-[5%] border border-stone-300"></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
