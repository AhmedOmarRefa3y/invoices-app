import React from "react";

const InvoiceTableHead = () => {
    return (
        <thead>
            <tr className=" border-stone-300 border border-t-0 bg-[#fafafa] sticky top-0  ">
                <th
                    align="center"
                    className="text-lg  border  border-stone-300  w-[5%] "
                ></th>
                <th
                    align="center"
                    className="text-lg  w-[55%] border border-l-0 border-stone-300"
                >
                    Product
                </th>
                <th
                    align="center"
                    className="text-lg  w-[10%] border border-l-0 border-stone-300"
                >
                    Quantity
                </th>
                <th
                    align="center"
                    className="text-lg    w-[10%] border border-l-0 border-stone-300"
                >
                    Price
                </th>
                <th
                    align="center"
                    className="text-lg    w-[10%] border border-l-0 border-stone-300"
                >
                    Amount
                </th>
                <th
                    align="center"
                    className="text-lg   w-[5%] border border-l-0 border-stone-300"
                ></th>
            </tr>
        </thead>
    );
};

export default InvoiceTableHead;
