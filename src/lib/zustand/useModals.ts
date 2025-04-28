import { create } from "zustand";
import { NewProductDataT } from "../types";

export interface ModalsT {
  addUnitMOdalIsOpen: boolean;
  setAddUnitModalIsOpen: (value: boolean) => void;
  addInventoryIsOpen: boolean;
  setAddInventoryModalIsOpen: (value: boolean) => void;
  addOrgMOdalIsOpen: boolean;
  setAddOrgModalIsOpen: (value: boolean) => void;
  AddcustomerModalIsOpen: boolean;
  SetAddcustomerModalIsOpen: (value: boolean) => void;
  customerToBeEdited:
    | {
        customerId: string;
        customerName: string;
        address: string;
        CreditType: string;
        OpenCredit: number;
        PhoneNumber: string;
      }
    | undefined;
  setcustomerToBeEdited: (
    value:
      | {
          customerId: string;
          customerName: string;
          address: string;
          CreditType: string;
          OpenCredit: number;
          PhoneNumber: string;
        }
      | undefined
  ) => void;
  ClearCustomerToBeEdited: () => void;
  AddProdctModalIsOpen: boolean;
  SetAddProdctModalIsOpen: (value: boolean) => void;
  productToBeEdited: NewProductDataT | null;
  setproductToBeEdited: (value: NewProductDataT | undefined) => void;
  AddPaymentModalIsOpen: boolean;
  SetAddPaymentModalIsOpen: (value: boolean) => void;
  PaymentToBeEdited:
    | {
        id: string;
        customerId: string;
        amount: number;
        Note: string;
        date: Date;
        method: string;
      }
    | undefined;
  setPaymentToBeEdited: (
    value:
      | {
          id: string;
          customerId: string;
          amount: number;
          Note: string;
          date: Date;
          method: string;
        }
      | undefined
  ) => void;
  clearPaymentToBeEdited: () => void;
  IsProductioModalOpen: boolean;
  SetIsProductioModalOpen: (value: boolean) => void;

  isSidebarOpen: boolean;
  toggleSideBar: () => void;
}

const useModals = create<ModalsT>()((set, get) => ({
  addOrgMOdalIsOpen: false,
  setAddOrgModalIsOpen(value) {
    set({ addOrgMOdalIsOpen: value });
  },
  addInventoryIsOpen: false,
  setAddInventoryModalIsOpen(value) {
    set({ addInventoryIsOpen: value });
  },
  addUnitMOdalIsOpen: false,
  setAddUnitModalIsOpen(value) {
    set({ addUnitMOdalIsOpen: value });
  },

  AddProdctModalIsOpen: false,
  IsProductioModalOpen: false,
  AddcustomerModalIsOpen: false,
  SetAddcustomerModalIsOpen(value) {
    set((state) => ({
      AddcustomerModalIsOpen: value,
    }));
  },
  SetIsProductioModalOpen(value) {
    set((state) => ({
      IsProductioModalOpen: value,
    }));
  },
  productToBeEdited: null,
  PaymentToBeEdited: undefined,
  customerToBeEdited: undefined,
  AddPaymentModalIsOpen: false,
  isSidebarOpen: false,

  setproductToBeEdited: (value) => {
    set((state) => ({
      productToBeEdited: value,
    }));
  },
  setPaymentToBeEdited(value) {
    set((state) => ({
      PaymentToBeEdited: value,
    }));
  },
  setcustomerToBeEdited(value) {
    set((state) => ({
      customerToBeEdited: value,
    }));
  },
  ClearCustomerToBeEdited() {
    set(() => ({
      customerToBeEdited: undefined,
    }));
  },
  clearPaymentToBeEdited() {
    set((state) => ({
      PaymentToBeEdited: undefined,
    }));
  },
  SetAddProdctModalIsOpen: (value) => {
    set((state) => ({
      AddProdctModalIsOpen: value,
    }));
  },
  SetAddPaymentModalIsOpen(value) {
    set((state) => ({
      AddPaymentModalIsOpen: value,
    }));
  },
  toggleSideBar() {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    }));
  },
  saveInvoice: () => {},
}));

export default useModals;
