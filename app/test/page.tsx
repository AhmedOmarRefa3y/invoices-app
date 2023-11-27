import prismaDb from "@/lib/prisma";
import React from "react";

const page = async () => {
    const invoice = await prismaDb.invoice.findFirst({
        where: {
            id: "8db05260-02be-45c1-bce2-28b74cf87593",
        },
        include: {
            lineItems: {
                include: {
                    product: {
                        include: {
                            Parts: true,
                        },
                    },
                },
            },
        },
    });
    console.log(invoice);

    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>الاسم</th>
                        <th>الكمية</th>
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
                                    <th>{part.quantity * lineitem.quantity}</th>
                                </tr>
                            );
                        });
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default page;
