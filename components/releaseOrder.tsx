import { Prisma } from "@prisma/client";
import React from "react";

interface releaseOrderProps {
    Invoice: invoice;
}

type invoice = Prisma.InvoiceGetPayload<{
    include: {
        customer: true;
        lineItems: {
            include: {
                product: {
                    include: {
                        Parts: true;
                    };
                };
            };
        };
        payment: true;
    };
}>;
let itemsNumber = 0;

const ReleaseOrder: React.FC<releaseOrderProps> = ({ Invoice }) => {
    return (
        <div className="overflow-x-auto flex flex-col drop-shadow-lg bg-white/40 justify-center items-center ">
            <div className="w-[80%] h-full flex flex-col justify-center  z-50   mt-5 rounded-lg p-5">
                <div className="w-full">
                    <div className="w-fit text-3xl mx-auto mb-3">
                        اذن صرف بضاعة{" "}
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <span className="w-[77px] inline-block ">
                                رقم الاذن
                            </span>
                            :
                            {Invoice?.number.toLocaleString("ar-EG", {
                                useGrouping: false,
                            })}
                        </div>
                        <div>
                            {" "}
                            <span className="w-fit inline-block pl-5">
                                تاريخ الفاتورة :
                            </span>
                            {Invoice?.date.toLocaleDateString("ar-EG", {
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
                        :{Invoice?.customer.name}
                    </div>
                </div>
                <table className="table table-sm w-full">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th className="w-[50%]">اسم الصنف</th>
                            <th className="w-[20%]">الكمية</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {Invoice?.lineItems.map((lineitem) => {
                            return lineitem.product.Parts.length > 0 ? (
                                lineitem.product.Parts.map((part) => {
                                    return (
                                        <tr key={part.id}>
                                            <th></th>
                                            <td>{part.name}</td>
                                            <th>
                                                {part.quantity *
                                                    lineitem.quantity}
                                            </th>
                                            <th></th>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <th></th>
                                    <td>{lineitem.product.name}</td>
                                    <th>{lineitem.quantity}</th>
                                    <th></th>
                                </tr>
                            );
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

export default ReleaseOrder;
