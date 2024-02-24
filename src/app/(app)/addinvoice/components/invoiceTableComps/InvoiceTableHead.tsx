import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead>
            <tr className="bg-slate-500 border-slate-500 border text-white">
                <th align="center" className="text-lg    w-[5%] ">
                    م
                </th>
                <th align="center" className="text-lg  w-[55%]">
                    البيـــــــــــــــــان
                </th>
                <th align="center" className="text-lg  w-[10%]">
                    الكمية
                </th>
                <th align="center" className="text-lg    w-[10%]">
                    السعر
                </th>
                <th align="center" className="text-lg    w-[10%]">
                    القيمة
                </th>
                <th align="center" className="text-lg   w-[5%]"></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
