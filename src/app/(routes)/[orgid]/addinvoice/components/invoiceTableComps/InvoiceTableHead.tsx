import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead className="sticky top-0 ">
            <tr className=" border-stone-300  bg-[#fafafa] ">
                <th align="center" className="text-lg    w-[5%] ">
                    <div className="border border-stone-300 border-collapse">
                        م
                    </div>
                </th>
                <th
                    align="center"
                    className="text-lg  w-[55%]   border-stone-300"
                >
                    <div className="border border-stone-300">
                        البيـــــــــــــــــان
                    </div>
                </th>
                <th align="center" className="text-lg  w-[10%] border-0">
                    <div className="border border-stone-300">الكمية</div>
                </th>
                <th align="center" className="text-lg    w-[10%] ">
                    <div className="border border-stone-300">السعر</div>
                </th>
                <th align="center" className="text-lg    w-[10%] 0">
                    <div className="border border-stone-300">القيمة</div>
                </th>
                <th align="center" className="text-lg   w-[5%] "></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
