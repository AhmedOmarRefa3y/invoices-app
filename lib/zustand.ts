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
    date: Date | undefined;
    customerId: string | null;
    AddProdctModalIsOpen: boolean;
    SetAddProdctModalIsOpen: (value: boolean) => void;
    addItem: (date: Item) => void;
    setCustomerId: (data: string) => void;
    saveInvoice: () => void;
    updateDate: (date: Date | undefined) => void;
    clearData: () => void;
    DelteItem: (id: string) => void;
}

const useInvoice = create(
    persist<Store>(
        (set, get) => ({
            items: [],
            date: new Date(),
            customerId: null,
            AddProdctModalIsOpen: false,
            SetAddProdctModalIsOpen: (value) => {
                set((state) => ({
                    AddProdctModalIsOpen: value,
                }));
            },
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
                    date: undefined,
                }));
            },
            DelteItem: (id) => {
                const NewItems = get().items.filter((item) => item.id !== id);
                set(() => ({
                    items: [...NewItems],
                }));
            },
        }),

        {
            name: "cart-ddstorage",
        }
    )
);

export default useInvoice;
