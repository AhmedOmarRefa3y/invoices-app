"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateProduct, getProductsData, UpdateProduct } from "@/actions/products";
import { DeleteUnit, UpdateUnit } from "@/actions/units";
import toast from "react-hot-toast";
import ProductDetails from "../component/product-details";
import ProductIngredients from "../component/product-parts";
import { useParams } from "next/navigation";
import { NewProductDataT } from "@/lib/types";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";
import { Catgories, Product, Units } from "@prisma/client";
import { DeleteCategory, UpdateCategory } from "@/actions/categories";

const AddNewProductModal = ({ orgID }: { orgID: string }) => {
  const t = useTranslations("products");
  const tActions = useTranslations("actions");
  const ModalsStore = useModals();
  const params: { orgid: string } = useParams();
  const { AddProdctModalIsOpen, SetAddProdctModalIsOpen, setproductToBeEdited, productToBeEdited } =
    ModalsStore;
  const [Data, setData] = useState<{
    products: Product[];
    units: Units[];
    categories: Catgories[];
  }>({
    products: [],
    units: [],
    categories: [],
  });

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
  const [Product, setProduct] = useState<NewProductDataT>({
    unitID: "",
    price: 0,
    categoryID: "",
    name: "",
    parts: [],
    PrdocutId: undefined,
    isAcomopsition: false,
    initalQuantity: 0,
    orgID: params.orgid,
  });

  const [units, setUnits] = useState<Units[]>(Data.units);
  const [categories, setCategories] = useState<Catgories[]>(Data.categories);

  useEffect(() => {
    if (productToBeEdited) {
      setProduct({
        unitID: productToBeEdited.unitID,
        price: productToBeEdited.price,
        categoryID: productToBeEdited.categoryID,
        name: productToBeEdited.name,
        parts: productToBeEdited.parts,
        PrdocutId: productToBeEdited.PrdocutId,
        isAcomopsition: productToBeEdited.isAcomopsition,
        initalQuantity: productToBeEdited.initalQuantity,
      });
      if (productToBeEdited.parts && productToBeEdited.parts.length > 0) {
        setType({ value: t("composition"), id: "2" });
      } else {
        setType({ value: t("single"), id: "1" });
      }
    }
  }, [productToBeEdited, t]);

  const [type, setType] = useState<{ value: string; id: string } | undefined>(undefined);

  const CategoriesD = categories.map((Category) => ({
    value: Category.name,
    id: Category.id,
  }));

  const unitsD = units.map((unit) => ({
    value: unit.name,
    id: unit.id,
  }));

  const types = [
    { value: t("single"), id: "1" },
    { value: t("composition"), id: "2" },
  ];

  const resetForm = () => {
    setProduct({
      unitID: "",
      price: 0,
      categoryID: "",
      name: "",
      parts: [],
      PrdocutId: undefined,
      isAcomopsition: false,
      orgID: params.orgid,
      initalQuantity: 0,
    });
    setType(undefined);
  };

  const saveData = async () => {
    try {
      if (!productToBeEdited) {
        const { message, status } = await CreateProduct({
          ...Product,
          orgID: params.orgid,
        });
        if (status === "ok") {
          SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
          toast.success(message);
          resetForm();
        } else {
          // Handle specific error cases
          if (message.includes("required")) {
            toast.error(t("missing_required_fields"));
          } else if (message.includes("unique")) {
            toast.error(t("product_name_exists"));
          } else {
            toast.error(message);
          }
        }
      } else {
        const { message, status } = await UpdateProduct({
          ...Product,
          orgID: params.orgid,
        });
        if (status === "ok") {
          SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
          toast.success(message);
          resetForm();
        } else {
          // Handle specific error cases
          if (message.includes("required")) {
            toast.error(t("missing_required_fields"));
          } else if (message.includes("unique")) {
            toast.error(t("product_name_exists"));
          } else {
            toast.error(message);
          }
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(t("unexpected_error_occurred"));
    }
  };

  const onOpenChangeHandler = () => {
    SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
    setproductToBeEdited(undefined);
    resetForm();
  };

  return (
    <Dialog open={AddProdctModalIsOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent className="flex flex-col md:w-fit w-[98%] z-[100] items-center ">
        <DialogHeader>
          <DialogTitle>{productToBeEdited ? t("edit_product") : t("add_product")}</DialogTitle>
        </DialogHeader>
        <div className="rounded-lg w-full h-full flex flex-col p-3 justify-between gap-2">
          <ProductDetails
            Product={Product}
            setProduct={setProduct}
            categories={CategoriesD}
            units={unitsD}
            types={types}
            type={type}
            setType={setType}
            productToBeEdited={productToBeEdited}
            onUpdateUnit={async (unitId: string, newName: string) => {
              try {
                const { message, status, Data } = await UpdateUnit({
                  UnitId: unitId,
                  UnitName: newName,
                  orgID: params.orgid,
                });
                if (status === "ok" && Data) {
                  // Update the local units state
                  setUnits((prevUnits) =>
                    prevUnits.map((unit) =>
                      unit.id === unitId ? { ...unit, name: newName } : unit
                    )
                  );
                  toast.success(t("unit_updated_successfully"));
                  return true;
                } else {
                  // Handle specific error cases
                  if (message.includes("required")) {
                    toast.error(t("unit_name_required"));
                  } else {
                    toast.error(message);
                  }
                  return false;
                }
              } catch (error) {
                console.error("Error updating unit:", error);
                toast.error(t("unexpected_error_occurred"));
                return false;
              }
            }}
            onUpdateCategory={async (categoryId: string, newName: string) => {
              try {
                const { message, status, Data } = await UpdateCategory({
                  CategoryId: categoryId,
                  CategoryName: newName,
                  orgID: params.orgid,
                });
                if (status === "ok" && Data) {
                  // Update the local categories state
                  setCategories((prevCategories) =>
                    prevCategories.map((category) =>
                      category.id === categoryId ? { ...category, name: newName } : category
                    )
                  );
                  toast.success(t("category_updated_successfully"));
                  return true;
                } else {
                  // Handle specific error cases
                  if (message.includes("required")) {
                    toast.error(t("category_name_required"));
                  } else {
                    toast.error(message);
                  }
                  return false;
                }
              } catch (error) {
                console.error("Error updating category:", error);
                toast.error(t("unexpected_error_occurred"));
                return false;
              }
            }}
            onDeleteUnit={async (unitId: string) => {
              try {
                const { message, status, Data } = await DeleteUnit({
                  UnitId: unitId,
                  orgID: params.orgid,
                });
                if (status === "ok" && Data) {
                  // Update the local units state
                  setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
                  toast.success(t("unit_deleted_successfully"));
                  return true;
                } else {
                  // Handle specific error cases
                  if (message.includes("in use")) {
                    toast.error(t("unit_in_use_cannot_delete"));
                  } else {
                    toast.error(message);
                  }
                  return false;
                }
              } catch (error) {
                console.error("Error deleting unit:", error);
                toast.error(t("unexpected_error_occurred"));
                return false;
              }
            }}
            onDeleteCategory={async (categoryId: string) => {
              try {
                const { message, status, Data } = await DeleteCategory({
                  CategoryId: categoryId,
                  orgID: params.orgid,
                });
                if (status === "ok" && Data) {
                  // Update the local categories state
                  setCategories((prevCategories) =>
                    prevCategories.filter((category) => category.id !== categoryId)
                  );
                  toast.success(t("category_deleted_successfully"));
                  return true;
                } else {
                  // Handle specific error cases
                  if (message.includes("in use")) {
                    toast.error(t("category_in_use_cannot_delete"));
                  } else {
                    toast.error(message);
                  }
                  return false;
                }
              } catch (error) {
                console.error("Error deleting category:", error);
                toast.error(t("unexpected_error_occurred"));
                return false;
              }
            }}
          />
          {(Product.isAcomopsition || type?.id === "2") && (
            <ProductIngredients
              Product={Product}
              setProduct={setProduct as any}
              products={Data.products}
            />
          )}
          <div className="items-center justify-center flex">
            <button
              className="bg-black p-2 text-white w-full rounded-lg hover:bg-black/80 duration-300"
              onClick={saveData}
            >
              {productToBeEdited ? tActions("update") : tActions("save")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewProductModal;
