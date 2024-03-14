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
        if (item.isAcomposistion && item.parts) {
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

    return (
        <div className="flex flex-col items-center justify-start h-screen pt-3">
            <div className="font-bold text-lg text-pink-500">الاصناف المجمعة ومكوناتها</div>
            <div className="flex gap-2">
                {composedItems.map((item, i) => {
                    if (item.parts) {
                        const smallestAvailableQuantity = Math.min(
                            ...item.parts.map((part) => part.availableQuantity)
                        );
                        console.log(smallestAvailableQuantity);
                        return (
                            <div
                                key={i}
                                className="flex flex-col gap-1 border border-stone-300 p-2 shadow-md"
                            >
                                <div className="flex  gap-1">
                                    <span className="font-bold text-sky-500">
                                        اسم الصنف المجمع :
                                    </span>
                                    <span className="font-semibold">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex  gap-1">
                                    <span className="font-bold text-sky-500">
                                        اقصي كمية متوفرة :
                                    </span>
                                    <span>{smallestAvailableQuantity}</span>
                                </div>
                                <div className="text-lg font-bold text-sky-500">
                                    المكونات:
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th
                                                className={`font-bold  hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto px-2 `}
                                            >
                                                م
                                            </th>
                                            <th
                                                className={`font-bold px-2 hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  `}
                                            >
                                                اسم الصنف
                                            </th>
                                            <th
                                                className={`font-bold  hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto px-2 `}
                                            >
                                                الوحدة
                                            </th>
                                            <th
                                                className={`font-bold  hover:bg-slate-400 hover:tew group border border-stone-300  text-black  relative  text-lg text-center mx-auto  px-2`}
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
                                                    className={`p-0 rounded-lg hover:bg-sky-400
                                                    ${
                                                        part.availableQuantity ===
                                                            smallestAvailableQuantity &&
                                                        "bg-sky-400"
                                                    } `}
                                                >
                                                    <td className="border border-stone-300 px-2">
                                                        {i + 1}
                                                    </td>
                                                    <td className="border border-stone-300 px-2">
                                                        {part.name}
                                                    </td>
                                                    <td className="border border-stone-300 px-2">
                                                        قطعة
                                                    </td>
                                                    <td className="border border-stone-300 px-2 text-center">
                                                        {part.availableQuantity}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default page;
