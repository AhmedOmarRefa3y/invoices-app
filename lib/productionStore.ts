import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductionProduct {
    id: string;
    name: string;
    Quantity: number;
    avaliableQuanttiy: number;
    unit?: string;
}
export interface ProdcutionStoreT {
    MainProducts: ProductionProduct[];
    AddMainProduct: (product: ProductionProduct) => void;
    updateProduct: (product: ProductionProduct) => void;
    DeleteProduct: (id: string) => void;
    RawMaterials: ProductionProduct[];
    AddRawMaterial: (product: ProductionProduct) => void;
    updateRawMaterial: (product: ProductionProduct) => void;
    DeleteRawMaterial: (id: string) => void;
}

const useProdcutionStore = create<ProdcutionStoreT>()(
    persist(
        (set, get) => ({
            MainProducts: [],
            RawMaterials: [],
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
            updateProduct(product) {
                const MainProducts = get().MainProducts;
                const index = MainProducts.findIndex(
                    (item) => item.id === product.id
                );
                MainProducts[index] = product;
                set(() => ({
                    MainProducts: MainProducts,
                }));
            },
            DeleteProduct(id) {
                const MainProducts = get().MainProducts;
                const index = MainProducts.findIndex((item) => item.id === id);
                MainProducts.splice(index, 1);
                set(() => ({
                    MainProducts: MainProducts,
                }));
            },
            AddRawMaterial(product) {
                const RawMaterials = get().RawMaterials;
                const isProductAllreadyThere = RawMaterials.find(
                    (item) => item.id === product.id
                );
                if (isProductAllreadyThere) return;
                RawMaterials.push(product);
                set(() => ({
                    RawMaterials: RawMaterials,
                }));
            },
            updateRawMaterial(product) {
                const RawMaterials = get().RawMaterials;
                const index = RawMaterials.findIndex(
                    (item) => item.id === product.id
                );
                RawMaterials[index] = product;
                set(() => ({
                    RawMaterials: RawMaterials,
                }));
            },
            DeleteRawMaterial(id) {
                const RawMaterials = get().RawMaterials;
                const index = RawMaterials.findIndex((item) => item.id === id);
                RawMaterials.splice(index, 1);
                set(() => ({
                    RawMaterials: RawMaterials,
                }));
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
