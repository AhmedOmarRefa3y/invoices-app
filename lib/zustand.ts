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
    date: Date;
    customerId: string | null;
    AddProdctModalIsOpen: boolean;
    AddPaymentModalIsOpen: boolean;
    productToBeEdited: {
        id: string;
        name: string;
        price: number;
    } | null;
    PaymentToBeEdited: {
        id: string;
        CustomerName: string;
        amount: number;
    } | null;
    paidAmount: number;
    InvoiceId: string | undefined;
    setInvoiceId: (InvoiceId: string) => void;
    setpaidAmount: (value: number) => void;
    setproductToBeEdited: (
        value: {
            id: string;
            name: string;
            price: number;
        } | null
    ) => void;
    setPaymentToBeEdited: (
        value: {
            id: string;
            CustomerName: string;
            amount: number;
        } | null
    ) => void;
    SetAddProdctModalIsOpen: (value: boolean) => void;
    SetAddPaymentModalIsOpen: (value: boolean) => void;
    addItem: (date: Item) => void;
    setCustomerId: (data: string | null) => void;
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
            productToBeEdited: null,
            PaymentToBeEdited: null,
            paidAmount: 0,
            InvoiceId: undefined,
            AddPaymentModalIsOpen: false,
            setInvoiceId(InvoiceId) {
                set(() => ({
                    InvoiceId: InvoiceId,
                }));
            },
            setpaidAmount(value) {
                set(() => ({
                    paidAmount: value,
                }));
            },
            setproductToBeEdited: (value) => {
                set((state) => ({
                    productToBeEdited: value,
                }));
            },
            setPaymentToBeEdited(value) {
                set((state) => ({
                    PaymentToBeEdited: value,
                }));
            },
            SetAddProdctModalIsOpen: (value) => {
                set((state) => ({
                    AddProdctModalIsOpen: value,
                }));
            },
            SetAddPaymentModalIsOpen(value) {
                set((state) => ({
                    AddProdctModalIsOpen: value,
                }));
            },
            addItem: (itemInfo) => {
                const newitem = { ...itemInfo };
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
                    paidAmount: 0,
                    productToBeEdited: null,
                    InvoiceId: undefined,
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
