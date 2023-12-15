import { Prisma } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Item {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
}

type part = {
    id: string;
    name: string;
    quantity: number;
    productId: string;
};

type LineItem = Prisma.LineItemGetPayload<{
    include: {
        product: true;
        invoice: true;
    };
}>;
interface Store {
    items: Item[];
    invoiceAmount: number;
    addItems: (items: LineItem[]) => void;
    updateItem: (itemNumber: number, updatedItem: Partial<Item>) => void;
    addRow: () => void;
    DelteItem: (number: number) => void;

    customerId: string | null;
    setCustomerId: (data: string | null) => void;

    date: Date;
    updateDate: (date: Date | undefined) => void;

    paidAmount: number;
    setpaidAmount: (value: number) => void;

    AddProdctModalIsOpen: boolean;
    SetAddProdctModalIsOpen: (value: boolean) => void;

    AddPaymentModalIsOpen: boolean;
    SetAddPaymentModalIsOpen: (value: boolean) => void;
    PaymentToBeEdited: {
        id: string;
        CustomerName: string;
        amount: number;
    } | null;
    setPaymentToBeEdited: (
        value: {
            id: string;
            CustomerName: string;
            amount: number;
        } | null
    ) => void;

    IsProductioModalOpen: boolean;
    SetIsProductioModalOpen: (value: boolean) => void;

    isSidebarOpen: boolean;
    toggleSideBar: () => void;

    productToBeEdited: {
        id: string;
        name: string;
        price: number;
        catgoryId: string | null;
        unitId: string | null;
        parts: part[];
    } | null;
    setproductToBeEdited: (
        value: {
            id: string;
            name: string;
            price: number;
            catgoryId: string | null;
            unitId: string | null;
            parts: part[];
        } | null
    ) => void;

    InvoiceId: string | undefined;
    setInvoiceId: (InvoiceId: string) => void;

    saveInvoice: () => void;

    clearData: () => void;

    Mode: { id: number };
    SetMode: (mode: { id: number }) => void;
}

const useInvoice = create<Store>()(
    persist(
        (set, get) => ({
            items: [{ number: 1, id: "", name: "", quantity: 0, price: 0 }],
            invoiceAmount: 0,
            updateItem(itemNumber, updatedItem) {
                const NewItems = get().items.map((item) => {
                    if (item.number === itemNumber) {
                        return { ...item, ...updatedItem };
                    }
                    return item;
                });
                let amount = 0;
                NewItems.forEach((item) => {
                    amount += item.price * item.quantity;
                });
                console.log(amount);

                set(() => ({
                    items: [...NewItems],
                    invoiceAmount: amount,
                }));
            },
            Mode: { id: 1, name: "مبيعات" },
            SetMode(ID) {
                set(() => ({
                    Mode: ID,
                }));
            },
            addItems(items) {
                const NewItems = items.map((item, i) => {
                    return {
                        number: i + 1,
                        id: item.product.id,
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price,
                    };
                });
                let amount = 0;
                NewItems.forEach((item) => {
                    amount += item.price * item.quantity;
                });
                console.log(amount);
                set(() => ({
                    items: [...NewItems],
                    invoiceAmount: amount,
                }));
            },
            DelteItem: (number) => {
                const NewItems =
                    number !== 1
                        ? get().items.filter((item) => item.number !== number)
                        : get().items.map((item) => {
                              if (item.number === 1) {
                                  //   console.log("das");

                                  return {
                                      ...item,
                                      name: "",
                                      price: 0,
                                      quantity: 0,
                                  };
                              }
                              return item;
                          });
                let amount = 0;
                NewItems.forEach((item) => {
                    amount += item.price * item.quantity;
                });
                console.log(amount);
                set(() => ({
                    items: [...NewItems],
                    invoiceAmount: amount,
                }));
            },
            addRow: () => {
                const Items = get().items;

                const lastItem = Items.findLast((item) => item);
                // console.log(lastItem);

                if (
                    lastItem &&
                    lastItem?.id.length > 1 &&
                    lastItem.quantity > 0
                ) {
                    set((state) => ({
                        items: [
                            ...state.items,
                            {
                                number: lastItem.number + 1,
                                id: "",
                                name: "",
                                quantity: 0,
                                price: 0,
                            },
                        ],
                    }));
                }
            },
            date: new Date(),
            updateDate: (date) => {
                set(() => ({
                    date: date,
                }));
            },
            customerId: null,
            AddProdctModalIsOpen: false,
            IsProductioModalOpen: false,
            SetIsProductioModalOpen(value) {
                set((state) => ({
                    IsProductioModalOpen: value,
                }));
            },
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
                invoiceAmount: state.invoiceAmount,
            }),
        }
    )
);

export default useInvoice;
