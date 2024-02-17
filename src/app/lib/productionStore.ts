import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductionProduct {
    id: string;
    name: string;
    Quantity: number;
    avaliableQuanttiy: number;
    unit: string;
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
    clearData: () => void;
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
                if (isProductAllreadyThere) {
                    const updatedItems = MainProducts.map((item) => {
                        if (item.id === product.id) {
                            item.Quantity += product.Quantity;
                            return item;
                        } else {
                            return item;
                        }
                    });
                    set(() => ({
                        MainProducts: updatedItems,
                    }));
                    console.log(get().MainProducts);
                } else {
                    set(() => ({
                        MainProducts: [...MainProducts, product],
                    }));
                }
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
                const filterdITems = MainProducts.filter(
                    (item) => item.id !== id
                );
                console.log(filterdITems);
                set(() => ({
                    MainProducts: filterdITems,
                }));
                const MainProductsd = get().MainProducts;
                console.log(MainProductsd);
            },
            AddRawMaterial(product) {
                const RawMaterials = get().RawMaterials;
                const isProductAllreadyThere = RawMaterials.find(
                    (item) => item.id === product.id
                );
                if (isProductAllreadyThere) {
                    const updatedItems = RawMaterials.map((item) => {
                        if (item.id === product.id) {
                            item.Quantity += product.Quantity;
                            return item;
                        } else {
                            return item;
                        }
                    });
                    set(() => ({
                        RawMaterials: updatedItems,
                    }));
                } else {
                    set(() => ({
                        RawMaterials: [...RawMaterials, product],
                    }));
                }
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
            clearData() {
                set(() => ({
                    MainProducts: [],
                    RawMaterials: [],
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
