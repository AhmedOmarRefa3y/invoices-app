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
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import useInvoice from "@/lib/zustand";
import { Product } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";
import { useState } from "react";

interface Item {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
}

interface InvoiceTableProps {
    products: Product[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ products }) => {
    const [Getitems, setItems] = useState<Item[]>([
        { number: 1, id: "", name: "", quantity: 0, price: 0 },
        { number: 2, id: "", name: "", quantity: 0, price: 0 },
        { number: 3, id: "", name: "", quantity: 0, price: 0 },
        // Add more items as needed
    ]);

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
    console.log(DataStore);

    let itemsNumber = 0;

    return (
        <div>
            <div className="overflow-x-auto mt-4">
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
                        {items.map((item) => {
                            itemsNumber += 1;
                            return (
                                <tr key={item.number}>
                                    <td className=" text-black font-semibold border border-black  text-center">
                                        {itemsNumber}
                                    </td>
                                    <td
                                        align="center"
                                        className=" text-black font-semibold border border-black p-0 duration-300  hover:bg-gray-400"
                                    >
                                        <div className="flex items-center h-full">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className=" flex items-center w-full h-full">
                                                        <div
                                                            className={cn(
                                                                `flex justify-between h-full bg-none w-full px-2 cursor-pointer   `
                                                            )}
                                                        >
                                                            <div className="">
                                                                {item.name}
                                                            </div>
                                                            <ChevronsUpDown className="w-4  shrink-0 " />
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[310px] p-0">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandInput
                                                                placeholder=""
                                                                className="bg-slate-200"
                                                            />
                                                            <CommandEmpty>
                                                                للا يوجد صنف
                                                                بهذاz الاسم
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {products.map(
                                                                    (
                                                                        productInfo
                                                                    ) => (
                                                                        <div
                                                                            className=" flex justify-between items-center "
                                                                            key={
                                                                                productInfo.id
                                                                            }
                                                                        >
                                                                            <CommandItem
                                                                                key={
                                                                                    item.number
                                                                                }
                                                                                onSelect={() => {
                                                                                    const currItemIndex =
                                                                                        items.findIndex;
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
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="text-sm w-full "
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
                                                                                <Edit
                                                                                    onClick={() => {
                                                                                        setproductToBeEdited(
                                                                                            {
                                                                                                id: productInfo.id,
                                                                                                name: productInfo.name,
                                                                                                price: productInfo.price,
                                                                                            }
                                                                                        );
                                                                                        SetAddProdctModalIsOpen(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                />
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
                                                            <PlusCircle className="mr-2  h-5 w-5" />
                                                        </div>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black "
                                    >
                                        {item.price > 0 ? item.price : ""}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black "
                                    >
                                        <input
                                            className=" outline-none bg-transparent text-center p-0 whitespace-pre-wrap w-full  border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 "
                                            type="number"
                                            min={"1"}
                                            value={
                                                item.quantity > 0
                                                    ? item.quantity
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                updateItem(item.number, {
                                                    quantity:
                                                        parseInt(
                                                            e.target.value
                                                        ) > 1
                                                            ? parseInt(
                                                                  e.target.value
                                                              )
                                                            : 1,
                                                })
                                            }
                                        />
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg  text-black font-semibold border border-black "
                                    >
                                        {item.price > 0 && item.quantity > 0
                                            ? item.price * item.quantity
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
                                            className="text-red-600  text-2xl"
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
                                className="text-lg text-black border border-black text-left pl-2"
                            >
                                إجمالي الفاتورة
                            </th>
                            <td
                                colSpan={1}
                                align="center"
                                className="text-lg text-black border border-black bg-orange-300"
                            >
                                {totalAmount}ج
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div
                    className="flex justify-start pr-2 items-center gap-2 text-sky-500  cursor-pointer hover:text-amber-500 "
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
