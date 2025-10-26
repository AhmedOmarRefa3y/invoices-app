"use client";
import AddNewProductModal from "@/components/modals/ProductModal";
import { AddNewCustomerModalNEW } from "@/components/modals/CustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import AddNewSupplierPaymentModal from "@/components/modals/addNewSupplierPaymentModal";
import { AddNewUnitModal } from "@/components/modals/addUnitModal";
import { AddNewCategoryModal } from "@/components/modals/addInventoryModal";
import useModals from "@/lib/zustand/useModals";
import AccountFormModal from "@/app/[locale]/(dashboard)/[orgid]/chart-of-accounts/components/AccountFormModal";

const GlobalModalManager = ({ orgID }: { orgID: string }) => {
  const {
    AddPaymentModalIsOpen,
    AddProdctModalIsOpen,
    AddcustomerModalIsOpen,
    addInventoryIsOpen,
    addUnitMOdalIsOpen,
    AddSupplierPaymentModalIsOpen,
    chartOfAccountsModalIsOpen,
  } = useModals();

  return (
    <>
      {AddPaymentModalIsOpen && <AddNewPaymentModal />}
      {AddSupplierPaymentModalIsOpen && <AddNewSupplierPaymentModal />}
      {AddProdctModalIsOpen && <AddNewProductModal orgID={orgID} />}
      {AddcustomerModalIsOpen && <AddNewCustomerModalNEW />}
      {addUnitMOdalIsOpen && <AddNewUnitModal />}
      {addInventoryIsOpen && <AddNewCategoryModal />}
      {chartOfAccountsModalIsOpen && <AccountFormModal />}
    </>
  );
};

export default GlobalModalManager;
