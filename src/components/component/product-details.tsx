"use client";

import type React from "react";
import { Combobox } from "../component/command";
import type { NewProductDataT } from "@/lib/types";
import { useTranslations } from "next-intl";

interface ProductDetailsProps {
  Product: NewProductDataT;
  setProduct: React.Dispatch<React.SetStateAction<NewProductDataT>>;
  categories: { value: string; id: string }[];
  units: { value: string; id: string }[];
  types: { value: string; id: string }[];
  type: { value: any; id: string | null } | undefined;
  setType: React.Dispatch<React.SetStateAction<{ value: string; id: string } | undefined>>;
  productToBeEdited: any;
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
}) => {
  const t = useTranslations("products");

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
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            {t("unit")}
          </label>
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
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            {t("inventory")}
          </label>
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
            />
          </div>
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
