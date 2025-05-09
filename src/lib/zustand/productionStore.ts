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
  productionPlanItems: ProductionProduct[];
  productionPlanProducts: ProductionProduct[];
  AddProductionPlanProduct: (product: ProductionProduct) => void;
  updateProductionPlanProduct: (product: ProductionProduct) => void;
  DeleteProductionPlanProduct: (id: string) => void;
  AddProductionPlanItems: (product: ProductionProduct) => void;
  updateProductionPlanItems: (product: ProductionProduct) => void;
  DeleteProductionPlanItem: (id: string) => void;
  AddMainProduct: (product: ProductionProduct) => void;
  updateProduct: (product: ProductionProduct) => void;
  DeleteProduct: (id: string) => void;
  RawMaterials: ProductionProduct[];
  AddRawMaterial: (product: ProductionProduct) => void;
  updateRawMaterial: (product: ProductionProduct) => void;
  DeleteRawMaterial: (id: string) => void;
  clearData: () => void;
  clearProductionPlanItems: () => void;
}

const useProdcutionStore = create<ProdcutionStoreT>()(
  persist(
    (set, get) => ({
      productionPlanItems: [],
      productionPlanProducts: [],
      AddProductionPlanProduct(product) {
        const productionPlanProducts = get().productionPlanProducts;
        const isProductAllreadyThere = productionPlanProducts.find(
          (item) => item.id === product.id
        );
        if (isProductAllreadyThere) {
          const updatedItems = productionPlanProducts.map((item) => {
            if (item.id === product.id) {
              item.Quantity += product.Quantity;
              return item;
            } else {
              return item;
            }
          });
          set(() => ({
            productionPlanProducts: updatedItems,
          }));
        } else {
          set(() => ({
            productionPlanProducts: [...productionPlanProducts, product],
          }));
        }
      },
      updateProductionPlanProduct(product) {
        const productionPlanProducts = get().productionPlanProducts;
        const index = productionPlanProducts.findIndex((item) => item.id === product.id);
        productionPlanProducts[index] = product;
        set(() => ({ productionPlanProducts: productionPlanProducts }));
      },
      DeleteProductionPlanProduct(id) {
        const productionPlanProducts = get().productionPlanProducts;
        const updatedItems = productionPlanProducts.filter((item) => item.id !== id);
        set(() => ({ productionPlanProducts: updatedItems }));
      },
      AddProductionPlanItems(product) {
        const productionPlanItems = get().productionPlanItems;
        const isProductAllreadyThere = productionPlanItems.find((item) => item.id === product.id);
        if (isProductAllreadyThere) {
          const updatedItems = productionPlanItems.map((item) => {
            if (item.id === product.id) {
              item.Quantity += product.Quantity;
              return item;
            } else {
              return item;
            }
          });
          set(() => ({
            productionPlanItems: updatedItems,
          }));
        } else {
          set(() => ({
            productionPlanItems: [...productionPlanItems, product],
          }));
        }
        console.log(get().productionPlanItems);
      },
      DeleteProductionPlanItem(id) {
        const productionPlanItems = get().productionPlanItems;
        const updatedItems = productionPlanItems.filter((item) => item.id !== id);
        set(() => ({
          productionPlanItems: updatedItems,
        }));
      },
      updateProductionPlanItems(product) {
        const productionPlanItems = get().productionPlanItems;
        const index = productionPlanItems.findIndex((item) => item.id === product.id);
        productionPlanItems[index] = product;
        set(() => ({
          productionPlanItems: productionPlanItems,
        }));
      },
      MainProducts: [],
      RawMaterials: [],
      AddMainProduct(product) {
        const MainProducts = get().MainProducts;
        const isProductAllreadyThere = MainProducts.find((item) => item.id === product.id);
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
          // console.log(get().MainProducts);
        } else {
          set(() => ({
            MainProducts: [...MainProducts, product],
          }));
        }
      },
      updateProduct(product) {
        const MainProducts = get().MainProducts;
        const index = MainProducts.findIndex((item) => item.id === product.id);
        MainProducts[index] = product;
        set(() => ({
          MainProducts: MainProducts,
        }));
      },
      DeleteProduct(id) {
        const MainProducts = get().MainProducts;
        const filterdITems = MainProducts.filter((item) => item.id !== id);
        // console.log(filterdITems);
        set(() => ({
          MainProducts: filterdITems,
        }));
      },
      AddRawMaterial(product) {
        const RawMaterials = get().RawMaterials;
        const isProductAllreadyThere = RawMaterials.find((item) => item.id === product.id);
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
        const index = RawMaterials.findIndex((item) => item.id === product.id);
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
          productionPlanProducts: [],
          productionPlanItems: [],
        }));
      },
      clearProductionPlanItems() {
        set(() => ({
          productionPlanItems: [],
        }));
      },
    }),
    {
      name: "ProdcutionStore",
      partialize: () => ({
        // MainProducts: state.MainProducts,
      }),
    }
  )
);

export default useProdcutionStore;
