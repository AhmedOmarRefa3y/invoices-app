"use client";
import AddNewProductModal from "@/components/modals/addProductModal";
import { AddNewCustomerModalNEW } from "@/components/modals/addCustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import { AddNewUnitModal } from "@/components/modals/addUnitModal";
import { AddNewCategoryModal } from "@/components/modals/addInventoryModal";
import useModals from "@/lib/zustand/useModals";

const GlobalModalManager = () => {
  const {
    AddPaymentModalIsOpen,
    AddProdctModalIsOpen,
    AddcustomerModalIsOpen,
    addInventoryIsOpen,
    addUnitMOdalIsOpen,
  } = useModals();

  return (
    <>
      {AddPaymentModalIsOpen && <AddNewPaymentModal />}
      {AddProdctModalIsOpen && <AddNewProductModal />}
      {AddcustomerModalIsOpen && <AddNewCustomerModalNEW />}
      {addUnitMOdalIsOpen && <AddNewUnitModal />}
      {addInventoryIsOpen && <AddNewCategoryModal />}
    </>
  );
};

export default GlobalModalManager;
