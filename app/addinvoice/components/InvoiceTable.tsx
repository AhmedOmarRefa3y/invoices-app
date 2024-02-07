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
import { Prisma } from "@prisma/client";
import { Check, ChevronsUpDown, Edit, PlusCircle } from "lucide-react";

interface InvoiceTableProps {
    products: product[];
}

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;
const InvoiceTable: React.FC<InvoiceTableProps> = ({ products }) => {
    console.log(products);

    let totalAmount = 0;
    const DataStore = useInvoice();
    const {
        items,
        updateItem,
        addRow,
        productToBeEdited,
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
                                الكمية
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
                                                <PopoverContent className="w-[500px] p-0 ">
                                                    <Command>
                                                        <CommandList >
                                                            <div className="sticky top-0 z-20 w-full">
                                                                <CommandInput
                                                                    placeholder=""
                                                                    className=" "
                                                                />
                                                                <div className="flex l p-2 rounded-sm items-center gap-2 font-bold text-lg bg-orange-300 aria-selected:bg-orange-300 mb-2  ">
                                                                    <span className="w-[80%]">
                                                                        اسم
                                                                        الصنف
                                                                    </span>
                                                                    <span className="w-[10%] text-center">
                                                                        السعر
                                                                    </span>
                                                                    <span className="w-[10%] text-center">
                                                                        تعديل
                                                                    </span>
                                                                </div>
                                                                <CommandEmpty className="text-lg text-center font-bold p-4">
                                                                    لا يوجد صنف
                                                                    بهذا الاسم
                                                                </CommandEmpty>
                                                            </div>

                                                            <CommandGroup className="overflow-y-hidden">
                                                                {products.map(
                                                                    (
                                                                        productInfo
                                                                    ) => (
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
                                                                                            productInfo.Part &&
                                                                                            productInfo
                                                                                                .Part
                                                                                                ?.length >
                                                                                                0
                                                                                                ? productInfo.Part.map(
                                                                                                      (
                                                                                                          part
                                                                                                      ) => {
                                                                                                          return {
                                                                                                              name: part.name,
                                                                                                              productid:
                                                                                                                  part.partProductId as string,
                                                                                                              quantity:
                                                                                                                  part.quantity,
                                                                                                          };
                                                                                                      }
                                                                                                  )
                                                                                                : undefined,
                                                                                    }
                                                                                );
                                                                                console.log(
                                                                                    items
                                                                                );
                                                                            }}
                                                                            className={`w-full text-sm my-1 hover:bg-slate-200 ${
                                                                                productInfo?.id ===
                                                                                    item.id &&
                                                                                "bg-emerald-200 hover:bg-emerald-200"
                                                                            }`}
                                                                        >
                                                                            <div className="w-[80%] flex text-base">
                                                                                <span>
                                                                                    {
                                                                                        productInfo.name
                                                                                    }
                                                                                </span>
                                                                                <Check
                                                                                    className={cn(
                                                                                        "mr-auto ml-2",
                                                                                        productInfo?.id ===
                                                                                            item.id
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                ></Check>
                                                                            </div>
                                                                            <span className="w-[10%] text-center text-lg">
                                                                                {
                                                                                    productInfo.price
                                                                                }
                                                                            </span>

                                                                            <Edit
                                                                                className="w-[10%] hover:text-red-700"
                                                                                onClick={() => {
                                                                                    setproductToBeEdited(
                                                                                        {
                                                                                            isAcomposition:
                                                                                                productInfo.isAcomopsition,
                                                                                            id: productInfo.id,
                                                                                            name: productInfo.name,
                                                                                            price: productInfo.price,
                                                                                            unitId: productInfo.unitId,
                                                                                            catgoryId:
                                                                                                productInfo.catgoryId,
                                                                                            parts: productInfo.Part.map(
                                                                                                (
                                                                                                    part
                                                                                                ) => {
                                                                                                    return {
                                                                                                        name: part.name,
                                                                                                        productid:
                                                                                                            part.partProductId as string,
                                                                                                        quantity:
                                                                                                            part.quantity,
                                                                                                    };
                                                                                                }
                                                                                            ),
                                                                                        }
                                                                                    );

                                                                                    SetAddProdctModalIsOpen(
                                                                                        true
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </CommandItem>
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
                                                                className="w-full text-xl rounded-none hover:bg-yellow-400 bg-yellow-200 "
                                                            >
                                                                اضافة صنف
                                                                <PlusCircle className="w-5 h-5 mr-2" />
                                                            </Button>
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
