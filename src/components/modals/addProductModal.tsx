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
} from "@/app/actions/products";
import useInvoice from "@/lib/zustand/invoiceStore";

import toast from "react-hot-toast";
import ProductDetails from "../component/product-details";
import ProductIngredients from "../component/product-parts";
import { useParams } from "next/navigation";

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
    const params: { orgid: string } = useParams();
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
        PrdocutId: undefined,
        isAcomopsition: undefined,
    });

    useEffect(() => {
        if (productToBeEdited) {
            setProduct({
                isAcomopsition: productToBeEdited.isAcomposition,
                PrdocutId: productToBeEdited.id,
                name: productToBeEdited.name,
                price: productToBeEdited.price,
                categoryID: productToBeEdited.catgoryId
                    ? productToBeEdited.catgoryId
                    : undefined,
                unitID: productToBeEdited.unitId
                    ? productToBeEdited.unitId
                    : undefined,
                parts: productToBeEdited.parts,
            });
            if (productToBeEdited.parts && productToBeEdited.parts.length > 0) {
                setType({ value: "صنف مجمع", id: "2" });
            } else {
                setType({ value: "صنف عادي", id: "1" });
            }
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

    const resetForm = () => {
        setProduct({
            unitID: undefined,
            price: undefined,
            categoryID: undefined,
            name: undefined,
            parts: undefined,
            PrdocutId: undefined,
        });
        setType(undefined);
    };
    const saveData = async () => {
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
                toast.error(message);
            }
        } else {
            const { message, status } = await UpdateProduct(Product);
            if (status === "ok") {
                SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
                toast.success(message);
                resetForm();
            } else {
                toast.error(message);
            }
        }
    };

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(undefined);
        resetForm();
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
                        productToBeEdited={productToBeEdited}
                    />
                    {(Product.isAcomopsition || type?.id === "2") && (
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
