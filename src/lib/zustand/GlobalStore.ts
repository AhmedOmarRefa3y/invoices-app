import { create } from "zustand";
import { persist } from "zustand/middleware";

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
export interface GlobalStore {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

const useGlobal = create<GlobalStore>()(
    persist(
        (set, get) => ({
            products: [],
            setProducts(products) {
                set({ products: products });
            },
        }),
        {
            name: "GlobalStore",
            partialize: (state) => ({}),
        }
    )
);

export default useGlobal;
