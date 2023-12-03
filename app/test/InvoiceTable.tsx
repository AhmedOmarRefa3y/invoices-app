"use client";
import { Button } from "@/components/ui/button";
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
import { Check, ChevronsUpDown, Edit } from "lucide-react";
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
    const DataStore = useInvoice();
    const { items, updateItems, addRow } = DataStore;
    console.log(DataStore);

    const [selectedItems, setSelectedItems] = useState<Item[]>([]);

    // const addRow = () => {
    //     setItems([
    //         ...items,
    //         {
    //             number: items.length + 1,
    //             id: "",
    //             name: "",
    //             quantity: 0,
    //             price: 0,
    //         },
    //     ]);
    // };

    // const handleInputChange = (
    //     itemNumber: number,
    //     updatedItem: Partial<Item>
    // ) => {
    //     const updatedItems = items.map((item) => {
    //         if (item.number === itemNumber) {
    //             return { ...item, ...updatedItem };
    //         }
    //         return item;
    //     });
    //     setItems(updatedItems);
    // };

    return (
        <div>
            <div className="overflow-x-auto mt-4">
                <table className="w-full mx-auto">
                    {/* head */}
                    <thead>
                        <tr className="bg-slate-500">
                            <th
                                align="center"
                                className="text-lg text-black border border-black"
                            ></th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black w-[60%]"
                            >
                                البيان
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black"
                            >
                                السعر
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black"
                            >
                                الكمية
                            </th>
                            <th
                                align="center"
                                className="text-lg text-black border border-black"
                            >
                                القيمة
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {items.map((item) => {
                            return (
                                <tr key={item.number}>
                                    <td className=" text-black font-semibold border border-black  text-center">
                                        {item.number}
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
                                                {/* {productEroor ? <span>{productEroor}</span> : null} */}

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
                                                                                    console.log(
                                                                                        productInfo.name
                                                                                    );
                                                                                    updateItems(
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
                                                                                            quantity:
                                                                                                item.id ===
                                                                                                productInfo.id
                                                                                                    ? 0
                                                                                                    : 1,
                                                                                        }
                                                                                    );
                                                                                    console.log(
                                                                                        item
                                                                                    );
                                                                                }}
                                                                                className="text-sm w-full "
                                                                            >
                                                                                {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
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
                                                                                {/* {productInfo?.price} */}
                                                                                {/* <Edit
                                                                            onClick={() => {
                                                                                setproductToBeEdited(
                                                                                    {
                                                                                        id: productInfo.id,
                                                                                        name: productInfo.name,
                                                                                        price: productInfo.price,
                                                                                    }
                                                                                );
                                                                                invoice.SetAddProdctModalIsOpen(
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
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.price}
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        <Input
                                            className=" outline-none bg-transparent text-center w-fit border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            type="number"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItems(item.number, {
                                                    quantity: parseInt(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                        />
                                    </td>
                                    <td
                                        align="center"
                                        className="text-lg text-black font-semibold border border-black"
                                    >
                                        {item.price *
                                            (item.quantity ? item.quantity : 1)}
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
                                className="text-lg text-black border border-black"
                            >
                                إجمالي الفاتورة
                            </th>
                            <td
                                colSpan={1}
                                align="center"
                                className="text-lg text-black border border-black bg-orange-300"
                            >
                                {/* {totalAmount}ج */}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <button onClick={addRow}>Add Row</button>
        </div>
    );
};

export default InvoiceTable;

{
    /* <table className="table table-xs w-[80%]">
    <thead className="">
        <tr>
            <th className="w-[10%]"></th>
            <th className="w-[45%]">اسم الصنف</th>
            <th className="w-[15%]">الكمية</th>
            <th className="w-[15%]">السعر</th>
            <th className="w-[15%]">القيمة</th>
        </tr>
    </thead>
    <tbody>
        {items.map((item) => {
            return (
                <tr key={item.number}>
                    <th>{item.number}</th>
                    <td className="w-[200px]">
                        <div className="w-full">
                            <Popover>
                                <div className="w-full overflow-hidden">
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"default"}
                                            size="sm"
                                            role="combobox"
                                            aria-label="اختر اسم الصنف"
                                            className={cn(
                                                `flex justify-between bg-none h-auto `
                                            )}
                                        >
                                            <span>{item.name}</span>
                                            <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    
                                </div>
                                <PopoverContent className="w-[310px] p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandInput placeholder="ابحث بالاسم..." />
                                            <CommandEmpty>
                                                للا يوجد صنف بهذاz الاسم
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {products.map((productInfo) => (
                                                    <div
                                                        className=" flex justify-between items-center "
                                                        key={productInfo.id}
                                                    >
                                                        <CommandItem
                                                            key={item.number}
                                                            onSelect={() => {
                                                                console.log(
                                                                    productInfo.name
                                                                );
                                                                handleInputChange(
                                                                    item.number,
                                                                    {
                                                                        id: productInfo.id,
                                                                        name: productInfo.name,
                                                                        price: productInfo.price,
                                                                    }
                                                                );
                                                                console.log(
                                                                    item
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
                                                                    "mr-auto w-4"
                                                                    // productInfo?.id ===
                                                                    //     prdouctID
                                                                    //     ? "opacity-100"
                                                                    //     : "opacity-0"
                                                                )}
                                                            ></Check>
                                                            {/* {productInfo?.price} */
}
{
    /* <Edit
                                                                            onClick={() => {
                                                                                setproductToBeEdited(
                                                                                    {
                                                                                        id: productInfo.id,
                                                                                        name: productInfo.name,
                                                                                        price: productInfo.price,
                                                                                    }
                                                                                );
                                                                                invoice.SetAddProdctModalIsOpen(
                                                                                    true
                                                                                );
                                                                            }}
                                                                        /> */
}
// </CommandItem>
// </div>
// ))}
//                                             </CommandGroup>
//                                         </CommandList>
//                                     </Command>
//                                 </PopoverContent>
//                             </Popover>
//                         </div>
//                     </td>
//                     <td>
//                         <input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                                 handleInputChange(item.number, {
//                                     quantity: parseInt(e.target.value),
//                                 })
//                             }
//                         />
//                     </td>
//                     <td>
//                         <input
//                             type="number"
//                             value={item.price}
//                             // onChange={(e) =>
//                             //     handleInputChange(
//                             //         item.number,
//                             //         "price",
//                             //         parseFloat(e.target.value)
//                             //     )
//                             // }
//                         />
//                     </td>
//                     <td>{item.price * item.quantity}</td>
//                 </tr>
//             );
//         })}
//     </tbody>
// </table>; */}
