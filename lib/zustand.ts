import { LineItem, Product } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Item {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
}

interface Store {
    items: Item[];
    updateItems: (itemNumber: number, updatedItem: Partial<Item>) => void;
    addRow: () => void;
    DelteItem: (number: number) => void;
    date: Date;
    customerId: string | null;
    AddProdctModalIsOpen: boolean;
    AddPaymentModalIsOpen: boolean;
    isSidebarOpen: boolean;
    toggleSideBar: () => void;
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

    setCustomerId: (data: string | null) => void;
    saveInvoice: () => void;
    updateDate: (date: Date | undefined) => void;
    clearData: () => void;
}

const useInvoice = create<Store>()(
    persist(
        (set, get) => ({
            items: [
                { number: 1, id: "", name: "", quantity: 0, price: 0 },
                { number: 2, id: "", name: "", quantity: 0, price: 0 },
                { number: 3, id: "", name: "", quantity: 0, price: 0 },
            ],
            updateItems(itemNumber, updatedItem) {
                const NewItems = get().items.map((item) => {
                    if (item.number === itemNumber) {
                        return { ...item, ...updatedItem };
                    }
                    return item;
                });
                console.log(NewItems);
                set(() => ({
                    items: [...NewItems],
                }));
            },
            DelteItem: (number) => {
                const NewItems = get().items.filter(
                    (item) => item.number !== number
                );

                set(() => ({
                    items: [...NewItems],
                }));
            },
            addRow: () => {
                const Items = get().items;

                set((state) => ({
                    items: [
                        ...state.items,
                        {
                            number: Items.length + 1,
                            id: "",
                            name: "",
                            quantity: 0,
                            price: 0,
                        },
                    ],
                }));
            },
            date: new Date(),
            updateDate: (date) => {
                set(() => ({
                    date: date,
                }));
            },
            customerId: null,
            AddProdctModalIsOpen: false,
            productToBeEdited: null,
            PaymentToBeEdited: null,
            paidAmount: 0,
            InvoiceId: undefined,
            AddPaymentModalIsOpen: false,
            isSidebarOpen: false,

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
                    AddPaymentModalIsOpen: value,
                }));
            },
            toggleSideBar() {
                set((state) => ({
                    isSidebarOpen: !state.isSidebarOpen,
                }));
            },

            setCustomerId: (CustomerId) => {
                set(() => ({
                    customerId: CustomerId,
                }));
            },
            saveInvoice: () => {},

            clearData: () => {
                set(() => ({
                    customerId: null,
                    items: [
                        { number: 1, id: "", name: "", quantity: 0, price: 0 },
                        { number: 2, id: "", name: "", quantity: 0, price: 0 },
                        { number: 3, id: "", name: "", quantity: 0, price: 0 },
                    ],
                    date: new Date(),
                    paidAmount: 0,
                    productToBeEdited: null,
                    InvoiceId: undefined,
                }));
            },
        }),
        {
            name: "cart-ddstorage",
            partialize: (state) => ({
                items: state.items,
                customerId: state.customerId,
                date: state.date,
                InvoiceId: state.InvoiceId,
            }),
        }
    )
);

export default useInvoice;
