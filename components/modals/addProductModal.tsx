"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Catgories, Product, Units } from "@prisma/client";

import React, { useState } from "react";
import { Combobox } from "../component/command";
import { CreateProduct } from "@/actions/products";

interface product {
    name: string | null;
    price: number | null;
    categoryID: string | null;
    unitID: string | null;
    parts: { productid: string; quantity: number; name: string }[];
}
interface AddNewProductModalT {
    products: Product[];
    categories: Catgories[];
    units: Units[];
}

const AddNewProductModal: React.FC<AddNewProductModalT> = ({
    categories,
    products,
    units,
}) => {
    const [Product, setProduct] = useState<product>({
        unitID: null,
        price: null,
        categoryID: null,
        name: null,
        parts: [],
    });

    const [type, setType] = useState<{
        value: any;
        id: string | number;
    } | null>(null);

    const CategoriesD = categories.map((Category) => {
        return {
            value: Category.name,
            id: Category.id,
        };
    });
    const unitsD = units.map((unit) => {
        return {
            value: unit.name,
            id: unit.id,
        };
    });

    const types = [
        { value: "صنف عادي", id: 1 },
        { value: "صنف مجمع", id: 2 },
    ];

    const saveData = () => {
        if (type?.id === 1) {
            CreateProduct(Product);
        }
    };
    return (
        <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className="flex flex-col  items-center">
                <DialogHeader>
                    <DialogTitle>اضافة صنف</DialogTitle>
                </DialogHeader>
                <div className="bg-amber-200 w-full h-full flex flex-col  p-3 justify-between gap-2">
                    <div>
                        <div className="flex items-center">
                            <label
                                htmlFor="Name"
                                className="font-bold  whitespace-nowrap"
                            >
                                اسم الصنف
                            </label>
                            <input
                                type="text"
                                name="Name"
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
                                    type="text"
                                    name="price"
                                    className="p-2   rounded-lg "
                                    placeholder="ادخل سعر الصنف هنا"
                                />
                            </div>
                            <div className=" col-span-1 flex flex-col ">
                                <label htmlFor="type" className="font-bold  ">
                                    الوحدة
                                </label>
                                <Combobox
                                    data={unitsD}
                                    onSelect={(unit) => {
                                        setProduct({
                                            ...Product,
                                            unitID: unit.id,
                                        });
                                    }}
                                />
                            </div>
                            <div className=" col-span-1 flex flex-col ">
                                <label htmlFor="unit" className="font-bold  ">
                                    المخزن
                                </label>
                                <Combobox
                                    data={CategoriesD}
                                    onSelect={(Category) => {
                                        setProduct({
                                            ...Product,
                                            categoryID: Category.id,
                                        });
                                    }}
                                />
                            </div>
                            <div className=" col-span-1 flex flex-col ">
                                <label htmlFor="unit" className="font-bold ">
                                    نوع الصنف
                                </label>
                                <Combobox data={types} onSelect={setType} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="unit" className="font-bold ">
                                    المكونات
                                </label>
                                <select
                                    className="p-2 w-full bg-slate-100 rounded-sm "
                                    onChange={(e) => {
                                        const selectedProductId =
                                            e.target.value;
                                        const selectedProduct = products.find(
                                            (product) =>
                                                product.id === selectedProductId
                                        );

                                        if (selectedProduct) {
                                            const parts = Product.parts;
                                            parts?.push({
                                                name: selectedProduct?.name,
                                                productid: selectedProduct.id,
                                                quantity: 1,
                                            });
                                            setProduct({
                                                ...Product,
                                                parts: parts,
                                            });
                                        }
                                    }}
                                >
                                    <option>{"اختر هنا"}</option>
                                    {products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <table className="bg-amber-600 border-1 border-black mt-2">
                                    <thead>
                                        <tr className="bg-orange-200">
                                            <td className="ml-auto border-1 border-black ">
                                                الاسم
                                            </td>
                                            <td className="border-1 border-black">
                                                الكمية
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Product.parts?.map((part, index) => (
                                            <tr key={index}>
                                                <td className="w-full border-1 border-black">
                                                    {part.name}
                                                </td>
                                                <td className="border-1 border-black w-12">
                                                    <input
                                                        className="w-full text-center "
                                                        type="number"
                                                        onChange={(e) => {
                                                            const newParts =
                                                                Product.parts.map(
                                                                    (part) => {
                                                                        if (
                                                                            part.productid ===
                                                                            part.productid
                                                                        ) {
                                                                            return {
                                                                                ...part,
                                                                                quantity:
                                                                                    e
                                                                                        .target
                                                                                        .valueAsNumber,
                                                                            };
                                                                        }
                                                                        return part;
                                                                    }
                                                                );

                                                            setProduct({
                                                                ...Product,
                                                                parts: newParts,
                                                            });

                                                            console.log(
                                                                Product.parts
                                                            );
                                                        }}
                                                        defaultValue={
                                                            part.quantity
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <button
                        className="bg-black p-2 text-white w-fit rounded-lg hover:bg-black/80 duration-300"
                        onClick={saveData}
                    >
                        حفظ الصنف
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewProductModal;
