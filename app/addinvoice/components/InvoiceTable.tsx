"use client";
import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";
import { TiDelete } from "react-icons/ti";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Prisma, Product, ProductPackage } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";

interface InvoiceTableProps {
    products: Product[];
    productsPackages: productPackageT[];
}

export type productPackageT = Prisma.ProductPackageGetPayload<{
    include: {
        Parts: true;
    };
}>;
const InvoiceTable: React.FC<InvoiceTableProps> = ({
    products,
    productsPackages,
}) => {
    const allProducts: {
        type: number;
        id: string;
        name: string;
        price: number;
        parts?: {}[];
    }[] = [];

    products.map((product) => {
        allProducts.push({
            id: product.id,
            name: product.name,
            price: product.price,
            type: 1,
        });
    });
    productsPackages.map((product) => {
        allProducts.push({
            id: product.id,
            name: product.name,
            price: product.price,
            type: 2,
            parts: product.Parts,
        });
    });

    let totalAmount = 0;
    const DataStore = useInvoice();
    const {
        items,
        updateItem,
        addRow,
        setproductToBeEdited,
        SetAddProdctModalIsOpen,
        DelteItem,
    } = DataStore;
    items.map((item) => {
        totalAmount += item.price * item.quantity;
    });

    return (
        <div>
            <div className="mt-4 overflow-x-auto">
                <table className="w-full mx-auto">
                    <thead>
                        <tr className="bg-slate-500">
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[5%]"
                            ></th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[55%]"
                            >
                                البيان
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[10%]"
                            >
                                السعر
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[10%]"
                            >
                                الكمية
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[10%]"
                            >
                                القيمة
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[5%]"
                            ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => {
                            return (
                                <tr key={i + 1}>
                                    <td className="font-semibold text-center text-black border border-black ">
                                        {i + 1}
                                    </td>
                                    <td
                                        align="center"
                                        className="p-0 font-semibold text-black duration-300 border border-black hover:bg-gray-400"
                                    >
                                        <div className="flex items-center h-full">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className="flex items-center w-full h-full ">
                                                        <div
                                                            className={cn(
                                                                `flex justify-between h-full bg-none w-full px-2 cursor-pointer   `
                                                            )}
                                                        >
                                                            <div className="">
                                                                {item.name}
                                                            </div>
                                                            <ChevronsUpDown className="w-4 shrink-0 " />
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[310px] p-0">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandInput
                                                                placeholder=""
                                                                className="pr-2"
                                                            />
                                                            <CommandEmpty>
                                                                للا يوجد صنف
                                                                بهذاz الاسم
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {allProducts.map(
                                                                    (
                                                                        productInfo
                                                                    ) => (
                                                                        <div
                                                                            className="flex items-center justify-between "
                                                                            key={
                                                                                productInfo.id
                                                                            }
                                                                        >
                                                                            <CommandItem
                                                                                key={
                                                                                    item.number
                                                                                }
                                                                                onSelect={() => {
                                                                                    updateItem(
                                                                                        item.number,
                                                                                        {
                                                                                            id:
                                                                                                item.id ===
                                                                                                productInfo.id
                                                                                                    ? ""
                                                                                                    : productInfo.id,
                                                                                            name:
                                                                                                item.id ===
                                                                                                productInfo.id
                                                                                                    ? ""
                                                                                                    : productInfo.name,
                                                                                            price:
                                                                                                item.id ===
                                                                                                productInfo.id
                                                                                                    ? 0
                                                                                                    : productInfo.price,
                                                                                            quantity: 0,
                                                                                            parts:
                                                                                                productInfo.type ===
                                                                                                2
                                                                                                    ? productInfo.parts
                                                                                                    : undefined,
                                                                                        }
                                                                                    );
                                                                                    console.log(
                                                                                        items
                                                                                    );
                                                                                }}
                                                                                className="w-full text-sm "
                                                                            >
                                                                                <span className="w-full">
                                                                                    {
                                                                                        productInfo.name
                                                                                    }
                                                                                </span>
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-auto w-4",
                                                                                        productInfo?.id ===
                                                                                            item.id
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                ></Check>
                                                                                {/* {
                                                                                    productInfo?.price
                                                                                } */}
                                                                                {/* <Edit
                                                                                    onClick={() => {
                                                                                        setproductToBeEdited(
                                                                                            {
                                                                                                id: productInfo.id,
                                                                                                name: productInfo.name,
                                                                                                price: productInfo.price,
                                                                                                catgoryId:
                                                                                                    productInfo.catgoryId,
                                                                                                unitId: productInfo.unitId,
                                                                                                parts: productInfo.Parts,
                                                                                            }
                                                                                        );
                                                                                        SetAddProdctModalIsOpen(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                /> */}
                                                                            </CommandItem>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                        <div className="flex items-center justify-center">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    SetAddProdctModalIsOpen(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                اضافة صنف
                                                            </Button>
                                                            <PlusCircle className="w-5 h-5 mr-2" />
                                                        </div>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </td>

                                    <td
                                        align="center"
                                        className="text-lg font-semibold text-black border border-black "
                                    >
                                        <input
                                            className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            type="number"
                                            min={1}
                                            value={
                                                item.price > 0 ? item.price : ""
                                            }
                                            onChange={(e) =>
                                                updateItem(item.number, {
                                                    price:
                                                        parseFloat(
                                                            e.target.value
                                                        ) > 1
                                                            ? parseFloat(
                                                                  e.target.value
                                                              )
                                                            : 1,
                                                })
                                            }
                                        />
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg font-semibold text-black border border-black "
                                    >
                                        <input
                                            className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            type="number"
                                            min={1}
                                            value={
                                                item.quantity > 0
                                                    ? item.quantity
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                updateItem(item.number, {
                                                    quantity:
                                                        parseFloat(
                                                            e.target.value
                                                        ) > 1
                                                            ? parseFloat(
                                                                  e.target.value
                                                              )
                                                            : 1,
                                                })
                                            }
                                        />
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg font-semibold text-black border border-black "
                                    >
                                        {item.price > 0 && item.quantity > 0
                                            ? (
                                                  item.price * item.quantity
                                              ).toFixed(2)
                                            : ""}
                                    </td>
                                    <td
                                        colSpan={1}
                                        align="center"
                                        className="text-lg text-black border border-black "
                                    >
                                        <TiDelete
                                            onClick={() => {
                                                DelteItem(item.number);
                                            }}
                                            className="text-2xl text-red-600"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th
                                colSpan={4}
                                align="center"
                                className="pl-2 text-lg text-left text-black border border-black"
                            >
                                إجمالي الفاتورة
                            </th>
                            <td
                                colSpan={1}
                                align="center"
                                className="text-lg text-black bg-orange-300 border border-black"
                            >
                                {totalAmount.toFixed(2)}ج
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div
                    className="flex items-center justify-start gap-2 pr-2 cursor-pointer text-sky-500 hover:text-amber-500 "
                    onClick={addRow}
                >
                    اضافة خانة
                    <GoPlus className="text-lg" />
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
