import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductionProduct } from "./types";

export interface ProdcutionStoreT {
    MainProducts: ProductionProduct[];
    AddMainProduct: (product: ProductionProduct) => void;
}

const useProdcutionStore = create<ProdcutionStoreT>()(
    persist(
        (set, get) => ({
            MainProducts: [],
            AddMainProduct(product) {
                const MainProducts = get().MainProducts;
                const isProductAllreadyThere = MainProducts.find(
                    (item) => item.productId === product.productId
                );
                if (isProductAllreadyThere) return;
                MainProducts.push(product);
                set(() => ({
                    MainProducts: MainProducts,
                }));
                console.log(get().MainProducts);
            },
        }),
        {
            name: "ProdcutionStore",
            partialize: (state) => ({
                // MainProducts: state.MainProducts,
            }),
        }
    )
);

export default useProdcutionStore;
