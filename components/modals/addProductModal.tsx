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
import {
    CreateProduct,
    CreateProductPackage,
    NewProductDataT,
} from "@/actions/products";
import toast from "react-hot-toast";
import useInvoice from "@/lib/zustand";

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
    const invoice = useInvoice();
    const {
        AddProdctModalIsOpen,
        SetAddProdctModalIsOpen,
        setproductToBeEdited,
        productToBeEdited,
    } = invoice;
    const [Product, setProduct] = useState<NewProductDataT>({
        unitID: null,
        price: null,
        categoryID: null,
        name: null,
        parts: [],
    });

    const [type, setType] = useState<{
        value: any;
        id: string | null;
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
        { value: "صنف عادي", id: "1" },
        { value: "صنف مجمع", id: "2" },
    ];

    const saveData = async () => {
        if (type?.id === "1") {
            const { message, status } = await CreateProduct(Product);
            if (status === "ok") {
                toast.success(message);
                setProduct({
                    unitID: null,
                    price: null,
                    categoryID: null,
                    name: null,
                    parts: [],
                });
            } else {
                toast.error(message);
            }
        } else {
            const { message, data, status } = await CreateProductPackage(
                Product
            );
            if (status === "ok") {
                toast.success(message);
                setProduct({
                    unitID: null,
                    price: null,
                    categoryID: null,
                    name: null,
                    parts: [],
                });
            } else {
                toast.error(message);
            }
        }
    };

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(null);
        setProduct({
            unitID: null,
            price: null,
            categoryID: null,
            name: null,
            parts: [],
        });
    };
    return (
        <Dialog open={AddProdctModalIsOpen} onOpenChange={onOpenChangeHandler}>
            <DialogContent className="flex flex-col  items-center">
                <DialogHeader>
                    <DialogTitle>اضافة صنف</DialogTitle>
                </DialogHeader>
                <div className="bg-amber-200 rounded-lg w-full h-full flex flex-col  p-3 justify-between gap-2">
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
                                <label htmlFor="type" className="font-bold  ">
                                    الوحدة
                                </label>
                                <Combobox
                                    selectedID={Product.unitID}
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
                                    selectedID={Product.categoryID}
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
                                <Combobox
                                    selectedID={type?.id}
                                    data={types}
                                    onSelect={setType}
                                />
                            </div>
                        </div>
                        {type?.id === "2" && (
                            <>
                                <div>
                                    <div>
                                        <label
                                            htmlFor="unit"
                                            className="font-bold "
                                        >
                                            المكونات
                                        </label>
                                        <select
                                            className="p-2 w-full bg-slate-100 rounded-sm "
                                            onChange={(e) => {
                                                const selectedProductId =
                                                    e.target.value;
                                                const selectedProduct =
                                                    products.find(
                                                        (product) =>
                                                            product.id ===
                                                            selectedProductId
                                                    );

                                                if (selectedProduct) {
                                                    const parts = Product.parts;
                                                    parts?.push({
                                                        name: selectedProduct?.name,
                                                        productid:
                                                            selectedProduct.id,
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
                                        <table className=" border-1 w-full border-black mt-2">
                                            <thead className="bg-orange-300">
                                                <tr>
                                                    <td className="ml-auto text-right border-1 w-[90%] border-black px-3">
                                                        الاسم
                                                    </td>
                                                    <td className="border-1 w-[10%] border-black px-3">
                                                        الكمية
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-orange-200">
                                                {Product.parts?.map(
                                                    (part, index) => (
                                                        <tr key={index}>
                                                            <td className="w-full border-1 border-black px-3">
                                                                {part.name}
                                                            </td>
                                                            <td className="border-1 border-black w-12">
                                                                <input
                                                                    className="w-full text-center "
                                                                    type="number"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newParts =
                                                                            Product.parts.map(
                                                                                (
                                                                                    part
                                                                                ) => {
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

                                                                        setProduct(
                                                                            {
                                                                                ...Product,
                                                                                parts: newParts,
                                                                            }
                                                                        );

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
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
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
