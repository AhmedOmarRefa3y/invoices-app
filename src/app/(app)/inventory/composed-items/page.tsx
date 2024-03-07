import { TableUi } from "@/components/table";

import { getAvailableProducts } from "../inventory-utils";
import { InventoryColumns } from "../tableComponents/columns";

export const dynamic = "force-dynamic";
const page = async ({ params }: { params: { id: string } }) => {
    const InventoryItems = await getAvailableProducts();

    const composedItems: {
        id: string;
        name: string;
        unit: string;
        parts:
            | {
                  id: string;
                  name: string;
                  availableQuantity: number;
              }[]
            | undefined;
    }[] = [];

    InventoryItems.map((item) => {
        if (item.isAcomposistion) {
            composedItems.push({
                id: item.id,
                name: item.productName,
                unit: item.unit as string,
                parts: item.parts?.map((part) => {
                    return {
                        id: part.partProductId as string,
                        availableQuantity: InventoryItems.find(
                            (item) => item.id === part.partProductId
                        )?.availableQuantity as number,
                        name: part.name as string,
                        // unit: part..
                    };
                }),
            });
        }
    });

    console.log(composedItems);
    return (
        <div className="flex items-center justify-center h-screen">
            {/* <TableUi
            columns={InventoryColumns}
            data={InventoryItems}
            filterAccessorKey="productName"
            filterlabel="اسم الصنف"
            filterplaceholder="البحث عن الصنف"
            notfound="لا يوجد صنف بهذا الاسم"
            visabilty={true}
        /> */}

            <div className="flex gap-2">
                {composedItems.map((item, i) => {
                    return (
                        <div
                            key={i}
                            className="flex flex-col gap-2 border border-stone-300"
                        >
                            <div>{item.name}</div>
                            <table>
                                <thead>
                                    <tr>
                                        <th
                                            className={`font-bold px-0 hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  `}
                                        >
                                            اسمa الصنف
                                        </th>
                                        <th
                                            className={`font-bold px-0 hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  `}
                                        >
                                            الوحدة
                                        </th>
                                        <th
                                            className={`font-bold px-0 hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  `}
                                        >
                                            العدد المتوفر
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {item.parts?.map((part, i) => {
                                        return (
                                            <tr
                                                key={i}
                                                className=" p-0 border-b-2 rounded-lg hover:bg-sky-400 "
                                            >
                                                <td>{part.name}</td>
                                                <td>قطعة</td>
                                                <td>
                                                    {part.availableQuantity}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default page;
