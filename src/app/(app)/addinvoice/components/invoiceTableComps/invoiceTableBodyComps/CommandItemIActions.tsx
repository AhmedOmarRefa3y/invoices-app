import useInvoice, { InvoiceItem } from "@/lib/zustand";
import React from "react";
import { TiDelete } from "react-icons/ti";

const CommandItemIActions = ({ item }: { item: InvoiceItem }) => {
    const DataStore = useInvoice();
    const { updateItem, DelteItem } = DataStore;
    return (
        <>
            <td
                align="center"
                className="text-lg font-semibold border border-stone-300  "
            >
                <input
                    className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={1}
                    value={item.quantity > 0 ? item.quantity : ""}
                    onChange={(e) =>
                        updateItem(item.number, {
                            quantity:
                                parseFloat(e.target.value) > 1
                                    ? parseFloat(e.target.value)
                                    : 1,
                        })
                    }
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold  border border-stone-300 "
            >
                <input
                    className="w-full p-0 text-center whitespace-pre-wrap bg-transparent border-none outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    type="number"
                    min={0}
                    value={item.price >= 0 ? item.price : ""}
                    onChange={(e) =>
                        updateItem(item.number, {
                            price:
                                parseFloat(e.target.value) > 0
                                    ? parseFloat(e.target.value)
                                    : 0,
                        })
                    }
                />
            </td>
            <td
                align="center"
                className="text-lg font-semibold    border border-stone-300 "
            >
                {item.price > 0 && item.quantity > 0
                    ? (item.price * item.quantity).toFixed(2)
                    : ""}
            </td>
            <td
                colSpan={1}
                align="center"
                className="text-lg  border border-stone-300 "
            >
                <TiDelete
                    onClick={() => {
                        DelteItem(item.number);
                    }}
                    className="text-2xl text-red-600"
                />
            </td>
        </>
    );
};

export default CommandItemIActions;
