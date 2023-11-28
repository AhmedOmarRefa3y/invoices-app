import { Invoice } from "@prisma/client";
import React from "react";

interface releaseOrderProps {
    invoice: Invoice;
}

const releaseOrder: React.FC<releaseOrderProps> = ({ invoice }) => {
    return (
        <div className="overflow-x-auto flex flex-col justify-center items-center ">
            <div className="w-[80%] h-full flex flex-col justify-center  z-50  drop-shadow-lg bg-white/40 mt-5 rounded-lg p-5">
                <div className="w-full">
                    <div className="w-fit text-3xl mx-auto mb-3">
                        اذن صرف بضاعة{" "}
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <span className="w-[77px] inline-block ">
                                رقم الفاتورة
                            </span>
                            :
                            {invoice?.number.toLocaleString("ar-EG", {
                                useGrouping: false,
                            })}
                        </div>
                        <div>
                            {" "}
                            <span className="w-fit inline-block pl-5">
                                تاريخ الفاتورة :
                            </span>
                            {invoice?.date.toLocaleDateString("ar-EG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                    <div>
                        {" "}
                        <span className="w-[77px] inline-block">
                            اسم العميل
                        </span>
                        :{invoice?.customer.name}
                    </div>
                </div>
                <table className="table table-sm w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>اسم الصنف</th>
                            <th>الكمية</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {invoice?.lineItems.map((lineitem) => {
                            return lineitem.product.Parts.map((part) => {
                                return (
                                    <tr>
                                        <th>1</th>
                                        <td>{part.name}</td>
                                        <th>
                                            {part.quantity * lineitem.quantity}
                                        </th>
                                        <th className="w-[60%]"></th>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                </table>
                <div className="flex justify-between mt-5 p-10">
                    <div>
                        <div>
                            <span className="w-[71px] inline-block ml-5">
                                اسم المستلم
                            </span>
                            :
                        </div>
                        <div>
                            {" "}
                            <span className="w-[71px] inline-block ml-5">
                                التوقيع
                            </span>
                            :
                        </div>
                    </div>
                    <div>
                        <div>القائم بالتحميل</div>
                    </div>
                    <div>
                        <div>اعداد</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default releaseOrder;
