import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead>
            <tr className="bg-slate-500">
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[5%]"
                ></th>
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[55%]"
                >
                    البيان
                </th>
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%]"
                >
                    الكمية
                </th>
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%]"
                >
                    السعر
                </th>
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[10%]"
                >
                    القيمة
                </th>
                <th
                    align="center"
                    className="text-lg text-black border border-black w-[5%]"
                ></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
