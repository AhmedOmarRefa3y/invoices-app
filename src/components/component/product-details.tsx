import React from "react";
import { Combobox } from "../component/command";
import { NewProductDataT } from "@/app/actions/products";
import { Button } from "../ui/button";
import useInvoice from "@/lib/zustand/invoiceStore";

interface ProductDetailsProps {
    Product: NewProductDataT;
    setProduct: React.Dispatch<React.SetStateAction<NewProductDataT>>;
    categories: { value: string; id: string }[];
    units: { value: string; id: string }[];
    types: { value: string; id: string }[];
    type: { value: any; id: string | null } | undefined;
    setType: React.Dispatch<
        React.SetStateAction<{ value: any; id: string | null } | undefined>
    >;
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
    return (
        <div>
            <div className="flex items-center">
                <label htmlFor="Name" className="font-bold  whitespace-nowrap">
                    اسم الصنف
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
                    className="p-2 w-full mr-2 rounded-lg"
                    placeholder="ادخل اسم الصنف هنا"
                />
            </div>
            <div className=" grid grid-cols-2 gap-2">
                <div className=" col-span-1 flex flex-col ">
                    <label htmlFor="price" className="font-bold  ">
                        سعر الصنف
                    </label>
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
                        className="p-2   rounded-lg "
                        placeholder="ادخل سعر الصنف هنا"
                    />
                </div>
                <div className=" col-span-1 flex flex-col ">
                    <label htmlFor="unit" className="font-bold  ">
                        الوحدة
                    </label>
                    <Combobox
                        selectedID={Product.unitID}
                        data={units}
                        onSelect={(unit) => {
                            setProduct({
                                ...Product,
                                unitID: unit.id,
                            });
                        }}
                        type="Unit"
                    />
                </div>
                <div className=" col-span-1 flex flex-col ">
                    <label htmlFor="unit" className="font-bold  ">
                        المخزن
                    </label>
                    <Combobox
                        selectedID={Product.categoryID}
                        data={categories}
                        onSelect={(Category) => {
                            setProduct({
                                ...Product,
                                categoryID: Category.id,
                            });
                        }}
                        type="Category"
                    />
                </div>
                <div
                    className={` col-span-1 flex flex-col ${
                        productToBeEdited &&
                        Product.parts &&
                        Product.parts.length > 0 &&
                        "hidden"
                    }`}
                >
                    <label htmlFor="unit" className="font-bold ">
                        نوع الصنف
                    </label>
                    <Combobox
                        selectedID={type && type.id ? type.id : undefined}
                        data={types}
                        onSelect={setType}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
