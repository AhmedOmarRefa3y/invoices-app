import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
    id: string;
    name: string;
    Quantity: number;
    unit: string;
}
export interface ProdcutionStoreT {
    InitaliQuanttiesProducts: Product[];
    AddProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    DeleteProduct: (id: string) => void;
}

const useInitaliQuanttiesStore = create<ProdcutionStoreT>()(
    persist(
        (set, get) => ({
            InitaliQuanttiesProducts: [],
            AddProduct(product) {
                const InitaliQuanttiesProducts = get().InitaliQuanttiesProducts;
                const isProductAllreadyThere = InitaliQuanttiesProducts.find(
                    (item) => item.id === product.id
                );
                if (isProductAllreadyThere) {
                    const updatedItems = InitaliQuanttiesProducts.map(
                        (item) => {
                            if (item.id === product.id) {
                                item.Quantity += product.Quantity;
                                return item;
                            } else {
                                return item;
                            }
                        }
                    );
                    set(() => ({
                        InitaliQuanttiesProducts: updatedItems,
                    }));
                } else {
                    set(() => ({
                        InitaliQuanttiesProducts: [
                            ...InitaliQuanttiesProducts,
                            product,
                        ],
                    }));
                }
            },
            updateProduct(product) {
                const InitaliQuanttiesProducts = get().InitaliQuanttiesProducts;
                const index = InitaliQuanttiesProducts.findIndex(
                    (item) => item.id === product.id
                );
                InitaliQuanttiesProducts[index] = product;
                set(() => ({
                    InitaliQuanttiesProducts: InitaliQuanttiesProducts,
                }));
            },
            DeleteProduct(id) {
                const InitaliQuanttiesProducts = get().InitaliQuanttiesProducts;
                const filterdITems = InitaliQuanttiesProducts.filter(
                    (item) => item.id !== id
                );
                set(() => ({
                    InitaliQuanttiesProducts: filterdITems,
                }));
            },
        }),
        {
            name: "ProdcutionStore",
            partialize: (state) => ({
            }),
        }
    )
);

export default useInitaliQuanttiesStore;
