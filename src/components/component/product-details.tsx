"use client";

import React, { useState } from "react";
import { Combobox } from "../component/command";
import type { NewProductDataT } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductDetailsProps {
  Product: NewProductDataT;
  setProduct: React.Dispatch<React.SetStateAction<NewProductDataT>>;
  categories: { value: string; id: string }[];
  units: { value: string; id: string }[];
  types: { value: string; id: string }[];
  type: { value: any; id: string | null } | undefined;
  setType: React.Dispatch<React.SetStateAction<{ value: string; id: string } | undefined>>;
  productToBeEdited: any;
  onUpdateUnit?: (unitId: string, newName: string) => Promise<boolean>;
  onUpdateCategory?: (categoryId: string, newName: string) => Promise<boolean>;
  onDeleteUnit?: (unitId: string) => Promise<boolean>;
  onDeleteCategory?: (categoryId: string) => Promise<boolean>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  Product,
  setProduct,
  categories,
  units,
  types,
  type,
  setType,
  productToBeEdited,
  onUpdateUnit,
  onUpdateCategory,
  onDeleteUnit,
  onDeleteCategory,
}) => {
  const t = useTranslations("products");
  const tActions = useTranslations("actions");
  const [editingUnit, setEditingUnit] = useState<{ id: string; name: string } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [unitName, setUnitName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [deletingUnit, setDeletingUnit] = useState<{ id: string; name: string } | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(
    null
  );

  // No additional code needed here as the variables are now properly used

  const handleUpdateUnit = async () => {
    if (editingUnit && onUpdateUnit) {
      const success = await onUpdateUnit(editingUnit.id, unitName);
      if (success) {
        setEditingUnit(null);
        setUnitName("");
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && onUpdateCategory) {
      const success = await onUpdateCategory(editingCategory.id, categoryName);
      if (success) {
        setEditingCategory(null);
        setCategoryName("");
      }
    }
  };

  const handleDeleteUnit = async () => {
    if (deletingUnit && onDeleteUnit) {
      const success = await onDeleteUnit(deletingUnit.id);
      if (success) {
        setDeletingUnit(null);
        // Reset the unit selection if the deleted unit was selected
        if (Product.unitID === deletingUnit.id) {
          setProduct({
            ...Product,
            unitID: "",
          });
        }
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (deletingCategory && onDeleteCategory) {
      const success = await onDeleteCategory(deletingCategory.id);
      if (success) {
        setDeletingCategory(null);
        // Reset the category selection if the deleted category was selected
        if (Product.categoryID === deletingCategory.id) {
          setProduct({
            ...Product,
            categoryID: "",
          });
        }
      }
    }
  };

  return (
    <div className="w-full space-y-6 bg-white rounded-lg">
      {/* Product Name */}
      <div className="space-y-1.5">
        <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
          {t("product_name")}
        </label>
        <input
          type="text"
          name="Name"
          value={Product.name || ""}
          onChange={(e) => {
            setProduct({
              ...Product,
              name: e.target.value,
            });
          }}
          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
          placeholder={t("product_name")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Price */}
        <div className="space-y-1.5">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            {t("price")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              value={Product.price || 0}
              name="price"
              onChange={(e) => {
                setProduct({
                  ...Product,
                  price: e.target.valueAsNumber,
                });
              }}
              className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Initial Stock */}
        <div className="space-y-1.5">
          <label htmlFor="openStock" className="block text-sm font-medium text-gray-700">
            {t("openStock")}
          </label>
          <input
            type="number"
            value={Product.initalQuantity || 0}
            name="openStock"
            onChange={(e) => {
              setProduct({
                ...Product,
                initalQuantity: e.target.valueAsNumber,
              });
            }}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-colors text-gray-900"
            placeholder="0"
          />
        </div>

        {/* Unit */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              {t("unit")}
            </label>
          </div>
          <div className="focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-md">
            <Combobox
              selectedID={Product.unitID}
              data={units}
              onSelect={(unit) => {
                setProduct({
                  ...Product,
                  unitID: unit.id,
                });
              }}
              type={"Unit"}
              onEdit={(id, name) => {
                setEditingUnit({ id, name });
                setUnitName(name);
              }}
              onDelete={(id, name) => {
                setDeletingUnit({ id, name });
              }}
            />
          </div>
          {/* Edit Unit Dialog */}
          <Dialog open={!!editingUnit} onOpenChange={(open) => !open && setEditingUnit(null)}>
            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span>{t("edit_unit")}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{t("unit_name")}</label>
                    <Input
                      value={unitName}
                      onChange={(e) => setUnitName(e.target.value)}
                      placeholder={t("unit_name")}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setEditingUnit(null)} className="px-4 py-2">
                      {tActions("cancel")}
                    </Button>
                    <Button onClick={handleUpdateUnit} className="px-4 py-2">
                      {t("update")}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Delete Unit Dialog */}
          <Dialog open={!!deletingUnit} onOpenChange={(open) => !open && setDeletingUnit(null)}>
            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span>{t("delete_unit")}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    {t("delete_unit_confirmation", { name: deletingUnit?.name || "" })}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setDeletingUnit(null)} className="px-4 py-2">
                    {tActions("cancel")}
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteUnit} className="px-4 py-2">
                    {tActions("delete")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              {t("inventory")}
            </label>
          </div>
          <div className="focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-md">
            <Combobox
              selectedID={Product.categoryID}
              data={categories}
              onSelect={(Category) => {
                setProduct({
                  ...Product,
                  categoryID: Category.id,
                });
              }}
              type={"Category"}
              onEdit={(id, name) => {
                setEditingCategory({ id, name });
                setCategoryName(name);
              }}
              onDelete={(id, name) => {
                setDeletingCategory({ id, name });
              }}
            />
          </div>
          {/* Edit Category Dialog */}
          <Dialog
            open={!!editingCategory}
            onOpenChange={(open) => !open && setEditingCategory(null)}
          >
            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <span>{t("edit_category")}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">{t("category_name")}</label>
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder={t("category_name")}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setEditingCategory(null)} className="px-4 py-2">
                      {tActions("cancel")}
                    </Button>
                    <Button onClick={handleUpdateCategory} className="px-4 py-2">
                      {t("update")}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Delete Category Dialog */}
          <Dialog
            open={!!deletingCategory}
            onOpenChange={(open) => !open && setDeletingCategory(null)}
          >
            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <span>{t("delete_category")}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    {t("delete_category_confirmation", { name: deletingCategory?.name || "" })}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setDeletingCategory(null)} className="px-4 py-2">
                    {tActions("cancel")}
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteCategory} className="px-4 py-2">
                    {tActions("delete")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Type - Hidden if product has parts */}
        {!(productToBeEdited && Product.parts && Product.parts.length > 0) && (
          <div className="space-y-1.5">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              {t("type")}
            </label>
            <div className="focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 rounded-md">
              <Combobox
                selectedID={type && type.id ? type.id : undefined}
                data={types}
                onSelect={setType}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
