import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProdcutionStoreT {
    ShowSalesView: boolean;
    setShowSalesView: (show: boolean) => void;
}

const Uistates = create<ProdcutionStoreT>()(
    persist(
        (set, get) => ({
            ShowSalesView: false,
            setShowSalesView: (show) => set({ ShowSalesView: show }),
        }),
        {
            name: "ProdcutionStore",
            partialize: (state) => ({
                // MainProducts: state.MainProducts,
            }),
        }
    )
);

export default Uistates;
