"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CreateProduct, UpdateProduct } from "@/actions/products";
import useInvoice from "@/lib/zustand/invoiceStore";

import toast from "react-hot-toast";
import ProductDetails from "../component/product-details";
import ProductIngredients from "../component/product-parts";
import { useParams } from "next/navigation";
import { CategoriesT, NewProductDataT, ProductT, UnitT } from "@/lib/types";
import useModals from "@/lib/zustand/useModals";

interface extendedProductT extends ProductT {
    parts?:
        | {
              productid: string;
              quantity: number;
              name: string;
          }[]
        | undefined;
}
interface AddNewProductModalT {
    products: extendedProductT[];
    categories: Pick<CategoriesT, "id" | "name" | "organizationId">[];
    units: Pick<UnitT, "id" | "name" | "organizationId">[];
}
const AddNewProductModal: React.FC<AddNewProductModalT> = ({
    categories,
    products,
    units,
}) => {
    const ModalsStore = useModals();
    const params: { orgid: string } = useParams();
    const {
        AddProdctModalIsOpen,
        SetAddProdctModalIsOpen,
        setproductToBeEdited,
        productToBeEdited,
    } = ModalsStore;

    const [Product, setProduct] = useState<NewProductDataT>({
        unitID: "",
        price: 0,
        categoryID: "",
        name: "",
        parts: [],
        PrdocutId: undefined,
        isAcomopsition: false,
        orgID: params.orgid,
    });

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
            });
            if (productToBeEdited.parts && productToBeEdited.parts.length > 0) {
                setType({ value: "Composition", id: "2" });
            } else {
                setType({ value: "Single", id: "1" });
            }
        }
    }, [productToBeEdited]);

    const [type, setType] = useState<{ value: string; id: string } | undefined>(
        undefined
    );

    const CategoriesD = categories.map((Category) => ({
        value: Category.name,
        id: Category.id,
    }));

    const unitsD = units.map((unit) => ({
        value: unit.name,
        id: unit.id,
    }));

    const types = [
        { value: "Single", id: "1" },
        { value: "Composition", id: "2" },
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
            const { message, status } = await UpdateProduct({
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
        }
    };

    const onOpenChangeHandler = () => {
        SetAddProdctModalIsOpen(!AddProdctModalIsOpen);
        setproductToBeEdited(undefined);
        resetForm();
    };

    return (
        <Dialog open={AddProdctModalIsOpen} onOpenChange={onOpenChangeHandler}>
            <DialogContent className="flex flex-col md:w-fit w-[98%] items-center z-[100]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className=" rounded-lg w-full h-full flex flex-col  p-3 justify-between gap-2">
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
                            setProduct={setProduct as any}
                            products={products}
                        />
                    )}
                    <div className="items-center justify-center flex ">
                        <button
                            className="bg-black p-2 text-white w-full rounded-lg hover:bg-black/80 duration-300 "
                            onClick={saveData}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewProductModal;
