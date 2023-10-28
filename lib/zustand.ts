import Invoice from "@/components/AddInvoice";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface InvoiceItem {
    id: string;
    name: string| undefined;
    price: number;
    quantity: number;
}

interface InvoiceType {
    customerId: string;
    date: string;
    items: InvoiceItem[];
}

interface Store {
    items: InvoiceItem[];
    invoice: InvoiceType;
    addItem: (data: InvoiceItem) => void;
    saveInvoice : ()=> void
}

const useInvoice = create(
    persist<Store>
    (
        (set, get) => ({
            items: [],
            invoice: {
                customerId: "",
                date: "",
                items: [],
            },
            addItem: (data) => {
                const newitem = {...data
                }
                set((state) => ({
                    items: [...state.items, newitem],
                    invoice: {
                        ...state.invoice,
                        items: [...state.invoice.items, newitem],
                    },
                }));
               
                
            },
            saveInvoice: ()=> {

            }
        }),
    
        {
            name: "cart-ddstorage",
        }
    )
);

export default useInvoice;