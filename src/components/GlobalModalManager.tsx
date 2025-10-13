"use client";
import AddNewProductModal from "@/components/modals/ProductModal";
import { AddNewCustomerModalNEW } from "@/components/modals/CustomerModal";
import AddNewPaymentModal from "@/components/modals/addNewPaymentModal";
import AddNewSupplierPaymentModal from "@/components/modals/addNewSupplierPaymentModal";
import { AddNewUnitModal } from "@/components/modals/addUnitModal";
import { AddNewCategoryModal } from "@/components/modals/addInventoryModal";
import useModals from "@/lib/zustand/useModals";
import { useEffect, useState } from "react";
import { Catgories, Product, Units } from "@prisma/client";
import { getProductsData } from "@/actions/products";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ViewPaymentModal from "@/components/modals/viewPaymentModal";
import AccountFormModal from "@/app/[locale]/(dashboard)/[orgid]/chart-of-accounts/components/AccountFormModal";

const GlobalModalManager = ({ orgID }: { orgID: string }) => {
  const [Data, setData] = useState<{
    products: Product[];
    units: Units[];
    categories: Catgories[];
  }>({
    products: [],
    units: [],
    categories: [],
  });
  const {
    AddPaymentModalIsOpen,
    AddProdctModalIsOpen,
    AddcustomerModalIsOpen,
    addInventoryIsOpen,
    addUnitMOdalIsOpen,
    AddSupplierPaymentModalIsOpen,
    chartOfAccountsModalIsOpen,
  } = useModals();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const Data = await getProductsData(orgID);
        if (Data.data) {
          setData(Data.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setData({
          products: [],
          units: [],
          categories: [],
        });
      }
    };
    fetchProducts();
  }, [orgID]);
  return (
    <>
      {AddPaymentModalIsOpen && <AddNewPaymentModal />}
      {AddSupplierPaymentModalIsOpen && <AddNewSupplierPaymentModal />}
      {AddProdctModalIsOpen && (
        <AddNewProductModal
          categories={Data.categories}
          products={Data.products}
          units={Data.units}
        />
      )}
      {AddcustomerModalIsOpen && <AddNewCustomerModalNEW />}
      {addUnitMOdalIsOpen && <AddNewUnitModal />}
      {addInventoryIsOpen && <AddNewCategoryModal />}
      {chartOfAccountsModalIsOpen && <AccountFormModal />}
    </>
  );
};

export default GlobalModalManager;
