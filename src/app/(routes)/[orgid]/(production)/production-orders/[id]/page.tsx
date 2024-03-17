import prismaDb from "@/lib/prisma";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
    // console.log(params);

    const ProdctionORder = await prismaDb.productionEvent.findUnique({
        include: {
            lineItems: {
                include: {
                    product: {
                        include: {
                            unit: true,
                        },
                    },
                },
            },
        },
        where: {
            id: params.id,
        },
    });
    // console.log(ProdctionORder);

    return (
        <div className="max-w-4xl mx-auto">
            <div>1 امر انتاج رقم</div>
            <div>
                <div>
                    <div>الاصناف المنتجة</div>
                    <div className="relative overflow-x-auto 0">
                        <table className="w-full bg-white border border-stone-300">
                            <thead className={`bg-[#fafafa]`}>
                                <tr>
                                    <th className="px-2 w-[5%] border border-stone-300">
                                        م
                                    </th>
                                    <th className="w-[55%] border border-stone-300">
                                        الصنف
                                    </th>
                                    <th className="w-[10%] border border-stone-300">
                                        الوحدة
                                    </th>
                                    <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                        الكمية المنتجة
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ProdctionORder?.lineItems.map((item, i) =>
                                    item.isProduction ? (
                                        <tr key={i}>
                                            <td className="border border-stone-300 text-center">
                                                {i + 1}
                                            </td>
                                            <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                                                {item.product.name}
                                            </td>
                                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                                {item.product.unit?.name}
                                            </td>
                                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                                {item.quantity}
                                            </td>
                                        </tr>
                                    ) : null
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div>الاصناف المستخدمة في الانتاج</div>
                    <div className="relative overflow-x-auto 0">
                        <table className="w-full bg-white border border-stone-300">
                            <thead className={`bg-[#fafafa]`}>
                                <tr>
                                    <th className="px-2 w-[5%] border border-stone-300 font-bold ">
                                        م
                                    </th>
                                    <th className="w-[55%] border border-stone-300">
                                        الصنف
                                    </th>
                                    <th className="w-[10%] border border-stone-300">
                                        الوحدة
                                    </th>
                                    <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                        الكمية المنصرفة
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ProdctionORder?.lineItems.map((item, i) =>
                                    item.isReduction ? (
                                        <tr key={i}>
                                            <td className="border border-stone-300 text-center font-bold ">
                                                {i + 1}
                                            </td>
                                            <td className="w-[55%] px-2  font-bold text-base border border-stone-300">
                                                {item.product.name}
                                            </td>
                                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                                {item.product.unit?.name}
                                            </td>
                                            <td className="w-[10%] text-center font-bold border border-stone-300">
                                                {item.quantity}
                                            </td>
                                        </tr>
                                    ) : null
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
