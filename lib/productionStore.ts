import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductionProduct {
    id: string;
    name: string;
    QuantityToProduce: number;
    avaliableQuanttiy: number;
}
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
                    (item) => item.id === product.id
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
