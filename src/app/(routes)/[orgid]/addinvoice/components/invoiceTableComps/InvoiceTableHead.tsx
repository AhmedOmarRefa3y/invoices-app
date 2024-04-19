import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead>
            <tr className=" border-stone-300 border border-t-0 bg-[#fafafa] sticky top-0  ">
                <th
                    align="center"
                    className="text-lg  border  border-stone-300  w-[5%] "
                >
                    م
                </th>
                <th
                    align="center"
                    className="text-lg  w-[55%] border border-r-0 border-stone-300"
                >
                    البيـــــــــــــــــان
                </th>
                <th
                    align="center"
                    className="text-lg  w-[10%] border border-r-0 border-stone-300"
                >
                    الكمية
                </th>
                <th
                    align="center"
                    className="text-lg    w-[10%] border border-r-0 border-stone-300"
                >
                    السعر
                </th>
                <th
                    align="center"
                    className="text-lg    w-[10%] border border-r-0 border-stone-300"
                >
                    القيمة
                </th>
                <th
                    align="center"
                    className="text-lg   w-[5%] border border-r-0 border-stone-300"
                ></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
