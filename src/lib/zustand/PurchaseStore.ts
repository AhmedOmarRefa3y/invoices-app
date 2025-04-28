import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NewProductDataT } from "../types";
import { Product } from "@prisma/client";

export interface PurchaseInvoiceItem {
  id: string;
  number: number;
  name: string;
  quantity: number;
  price: number;
}

export interface PurchaseInvoiceStore {
  PurchaseInvoiceItems: PurchaseInvoiceItem[];
  PurchaseInvoiceAmount: number;
  AddItems: (items: PurchaseInvoiceItem[]) => void;
  UpdateItem: (itemNumber: number, updatedItem: Partial<PurchaseInvoiceItem>) => void;
  AddRow: () => void;
  DelteItem: (number: number) => void;
  SupplierId: string | null;
  setSupplierId: (data: string | null) => void;
  Date: Date;
  UpdateDate: (date: Date | undefined) => void;
  PaidAmount: number;
  SetpaidAmount: (value: number) => void;
  InvoiceId: string | undefined;
  SetInvoiceId: (InvoiceId: string) => void;
  // SaveInvoice: () => void;
  ClearData: () => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
}

const usePurchaseInvoice = create<PurchaseInvoiceStore>()(
  persist(
    (set, get) => ({
      products: [],
      setProducts(products) {
        set({ products: products });
      },
      PurchaseInvoiceItems: [{ number: 1, id: "", name: "", quantity: 0, price: 0 }],
      PurchaseInvoiceAmount: 0,
      AddItems(items) {
        const NewItems: PurchaseInvoiceItem[] = items.map((item, i) => {
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
        set(() => ({
          PurchaseInvoiceItems: [...NewItems],
          PurchaseInvoiceAmount: amount,
        }));
      },
      UpdateItem(itemNumber, updatedItem) {
        const NewItems = get().PurchaseInvoiceItems.map((item) => {
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
          PurchaseInvoiceItems: [...NewItems],
          PurchaseInvoiceAmount: amount,
        }));
      },
      AddRow: () => {
        const Items = get().PurchaseInvoiceItems;

        const lastItem = Items.findLast((item) => item);

        if (lastItem && lastItem?.id.length > 1 && lastItem.quantity > 0) {
          set((state) => ({
            PurchaseInvoiceItems: [
              ...state.PurchaseInvoiceItems,
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
      DelteItem: (number) => {
        const NewItems =
          number !== 1
            ? get().PurchaseInvoiceItems.filter((item) => item.number !== number)
            : get().PurchaseInvoiceItems.map((item) => {
                if (item.number === 1) {
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
        set(() => ({
          PurchaseInvoiceItems: [...NewItems],
          PurchaseInvoiceAmount: amount,
        }));
      },

      Date: new Date(),
      UpdateDate: (date) => {
        set(() => ({
          Date: date,
        }));
      },
      SupplierId: null,
      PaidAmount: 0,
      InvoiceId: undefined,

      SetpaidAmount(value) {
        set(() => ({
          PaidAmount: value,
        }));
      },

      setSupplierId: (SupplierId) => {
        set(() => ({
          SupplierId: SupplierId,
        }));
      },
      SetInvoiceId(InvoiceId) {
        set(() => ({
          InvoiceId: InvoiceId,
        }));
      },
      ClearData: () => {
        set(() => ({
          SupplierId: null,
          PurchaseInvoiceItems: [{ number: 1, id: "", name: "", quantity: 0, price: 0 }],
          Date: new Date(),
          PaidAmount: 0,
          InvoiceId: undefined,
        }));
      },
    }),
    {
      name: "PurchaseInvoice",
      partialize: (state) => ({
        PurchaseInvoiceItems: state.PurchaseInvoiceItems,
        SupplierId: state.SupplierId,
        InvoiceId: state.InvoiceId,
        PurchaseInvoiceAmount: state.PurchaseInvoiceAmount,
      }),
    }
  )
);

export default usePurchaseInvoice;
