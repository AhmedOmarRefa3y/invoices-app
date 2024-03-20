import prismaDb from "@/lib/prisma";
import React from "react";

const page = async ({ params }: { params: { id: string; orgid: string } }) => {
    // console.log(params);

    const ProdctionPlan = await prismaDb.productionPlan.findUnique({
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
            ProductionEvents: {
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
            },
            Products: {
                include: {
                    Product: {
                        include: {
                            unit: true,
                        },
                    },
                },
            },
        },
        where: {
            id: params.id,
            organizationId: params.orgid,
        },
    });
    const items:
        | {
              id: string;
              name: string;
              unit: string;
              quantity: number;
              produced: number;
          }[]
        | undefined = ProdctionPlan?.lineItems.map((item, i) => {
        return {
            id: item.product.id,
            name: item.product.name,
            unit: item.product.unit?.name as string,
            quantity: item.quantity,
            produced: 0,
        };
    });
    ProdctionPlan?.ProductionEvents.map((ProductionEvent, i) => {
        ProductionEvent.lineItems?.map((itemDDD) => {
            const itemD = items?.find(
                (itemDD) => itemDD.id === itemDDD.product.id
            );
            if (itemD) {
                itemD.produced += itemDDD.quantity;
            }
        });
    });
    return (
        <div className="max-w-4xl mx-auto">
            <div>خطة انتاج رقم {ProdctionPlan?.number}</div>
            <div>
                <div>
                    <div>الاصناف </div>
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
                                        الكمية
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ProdctionPlan?.Products?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border border-stone-300 text-center">
                                            {i + 1}
                                        </td>
                                        <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                                            {item.Product.name}
                                        </td>
                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.Product.unit?.name}
                                        </td>
                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <div>الاجزاء</div>
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
                                        الكمية
                                    </th>
                                    <th className="w-[10%] whitespace-nowrap border border-stone-300">
                                        الكمية المنتجة الي الان
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border border-stone-300 text-center">
                                            {i + 1}
                                        </td>
                                        <td className="w-[55%] px-2 bg font-bold text-base border border-stone-300">
                                            {item.name}
                                        </td>
                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.unit}
                                        </td>
                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.quantity}
                                        </td>
                                        <td className="w-[10%] text-center font-bold border border-stone-300">
                                            {item.produced}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;
