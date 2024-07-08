import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InvoiceItem {
    id: string;
    number: number;
    name: string;
    quantity: number;
    price: number;
}
interface Product {
    id: string;
    name: string;
    price: number;
    Part:
        | {
              product: {
                  name: string;
                  price: number;
              };
              name: string;
              partProductId: string;
              quantity: number;
          }[];
    isAcomopsition: boolean;
    catgoryId: string;
    unitId: string;
}
export interface ReturnsStore {
    items: InvoiceItem[];
    addItems: (items: InvoiceItem[]) => void;
    updateItem: (itemNumber: number, updatedItem: Partial<InvoiceItem>) => void;
    DelteItem: (number: number) => void;
    customerId: string | null;
    setCustomerId: (data: string | null) => void;
    date: Date;
    updateDate: (date: Date | undefined) => void;
    paidAmount: number;
    setpaidAmount: (value: number) => void;
    InvoiceId: string | undefined;
    setInvoiceId: (InvoiceId: string) => void;
    invoiceAmount: number;
    addRow: () => void;
    saveInvoice: () => void;
    clearData: () => void;
}

const useReturnsInvoice = create<ReturnsStore>()(
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

                set(() => ({
                    items: [...NewItems],
                    invoiceAmount: amount,
                }));
            },

            addItems(items) {
                const NewItems: InvoiceItem[] = items.map((item, i) => {
                    return {
                        number: i + 1,
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    };
                });
                let amount = 0;
                NewItems.forEach((item) => {
                    amount += item.price * item.quantity;
                });
                // console.log(amount);
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
                // console.log(amount);
                set(() => ({
                    items: [...NewItems],
                    invoiceAmount: amount,
                }));
            },
            addRow: () => {
                const Items = get().items;

                const lastItem = Items.findLast((item) => item);

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
            name: "ReturnsInvoice",
            partialize: (state) => ({
                items: state.items,
                customerId: state.customerId,
                InvoiceId: state.InvoiceId,
                invoiceAmount: state.invoiceAmount,
            }),
        }
    )
);

export default useReturnsInvoice;
