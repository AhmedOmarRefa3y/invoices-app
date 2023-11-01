import { LineItem, Product } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Item {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface Store {
    items: Item[];
    date: Date | null;
    customerId: string | null;
    addItem: (date: Item) => void;
    setCustomerId: (data: string) => void;
    saveInvoice: () => void;
    updateDate: (date: Date) => void;
    clearData: () => void;
}

const useInvoice = create(
    persist<Store>(
        (set, get) => ({
            items: [],
            date: null,
            customerId: null,
            addItem: (date) => {
                const newitem = { ...date };
                set((state) => ({
                    items: [...state.items, newitem],
                }));
            },
            setCustomerId: (CustomerId) => {
                set(() => ({
                    customerId: CustomerId,
                }));
            },
            saveInvoice: () => {},
            updateDate: (date) => {
                set(() => ({
                    date: date,
                }));
            },
            clearData: () => {
                set(() => ({
                    customerId: null,
                    items: [],
                    date: null,
                }));
            },
        }),

        {
            name: "cart-ddstorage",
        }
    )
);

export default useInvoice;
