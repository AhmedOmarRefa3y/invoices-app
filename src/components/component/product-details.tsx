import React from "react";
import { Combobox } from "../component/command";
import { NewProductDataT } from "@/lib/types";

interface ProductDetailsProps {
    Product: NewProductDataT;
    setProduct: React.Dispatch<React.SetStateAction<NewProductDataT>>;
    categories: { value: string; id: string }[];
    units: { value: string; id: string }[];
    types: { value: string; id: string }[];
    type: { value: any; id: string | null } | undefined;
    setType: React.Dispatch<
        React.SetStateAction<{ value: string; id: string } | undefined>
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
        <div className="grid grid-cols-1 w-full gap-2">
            <div className="flex flex-col w-full">
                <label htmlFor="Name" className="font-bold  whitespace-nowrap">
                    Product Name
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
                    className="h-full w-full text-lg flex items-center text-center py-1 font-bold rounded-sm border border-stone-300 "
                    placeholder="Product Name"
                />
            </div>
            <div className=" sm:grid sm:grid-cols-2 sm:gap-2">
                <div className=" col-span-1 flex flex-col ">
                    <label htmlFor="price" className="font-bold  ">
                        Price
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
                        className="h-full w-full text-lg flex items-center text-center font-bold rounded-sm border border-stone-300 "
                        placeholder="Price"
                    />
                </div>
                <div className=" col-span-1 flex flex-col ">
                    <label htmlFor="unit" className="font-bold  ">
                        Unit
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
                        Inventory
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
                        Type
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
