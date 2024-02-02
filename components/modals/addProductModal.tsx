"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Catgories, Prisma, Units } from "@prisma/client";
import {
    NewProductDataT,
    CreateProduct,
    UpdateProduct,
} from "@/actions/products";
import useInvoice from "@/lib/zustand";
import toast from "react-hot-toast";
import { Combobox } from "../component/command";
import ProductDetails from "../component/product-details";
import ProductIngredients from "../component/product-parts";

export type product = Prisma.ProductGetPayload<{
    include: {
        Part: true;
    };
}>;

interface AddNewProductModalT {
    products: product[];
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
        unitID: undefined,
        price: undefined,
        categoryID: undefined,
        name: undefined,
        parts: undefined,
    });

    useEffect(() => {
        if (productToBeEdited) {
            setProduct({
                categoryID: productToBeEdited.catgoryId
                    ? productToBeEdited.catgoryId
                    : undefined,
                name: productToBeEdited.name,
                parts: productToBeEdited.parts,
                price: productToBeEdited.price,
                unitID: productToBeEdited.unitId
                    ? productToBeEdited.unitId
                    : undefined,
                PrdocutId: productToBeEdited.id,
            });
        }
    }, [productToBeEdited]);

    const [type, setType] = useState<
        { value: any; id: string | null } | undefined
    >(undefined);

    const CategoriesD = categories.map((Category) => ({
        value: Category.name,
        id: Category.id,
    }));

    const unitsD = units.map((unit) => ({
        value: unit.name,
        id: unit.id,
    }));

    const types = [
        { value: "صنف عادي", id: "1" },
        { value: "صنف مجمع", id: "2" },
    ];

    const saveData = async () => {
        if (!productToBeEdited) {
            const { message, status } = await CreateProduct(Product);
            if (status === "ok") {
                toast.success(message);
                setProduct({
                    unitID: undefined,
                    price: undefined,
                    categoryID: undefined,
                    name: undefined,
                    parts: undefined,
                });
                setType(undefined);
            } else {
                toast.error(message);
            }
        } else {
            const { message, status } = await UpdateProduct(Product);
            if (status === "ok") {
                toast.success(message);
                setProduct({
                    unitID: undefined,
                    price: undefined,
                    categoryID: undefined,
                    name: undefined,
                    parts: undefined,
                });
                setType(undefined);
            } else {
                toast.error(message);
            }
        }
    };

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(undefined);
        setProduct({
            unitID: undefined,
            price: undefined,
            categoryID: undefined,
            name: undefined,
            parts: undefined,
        });
        setType(undefined);
    };

    return (
        <Dialog open={AddProdctModalIsOpen} onOpenChange={onOpenChangeHandler}>
            <DialogContent className="flex flex-col  items-center">
                <DialogHeader>
                    <DialogTitle>اضافة صنف</DialogTitle>
                </DialogHeader>
                <div className="bg-amber-200 rounded-lg w-full h-full flex flex-col  p-3 justify-between gap-2">
                    <ProductDetails
                        Product={Product}
                        setProduct={setProduct}
                        categories={CategoriesD}
                        units={unitsD}
                        types={types}
                        type={type}
                        setType={setType}
                    />
                    {type?.id === "2" && (
                        <ProductIngredients
                            Product={Product}
                            setProduct={setProduct}
                            products={products}
                        />
                    )}
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
