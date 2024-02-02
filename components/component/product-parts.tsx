import React from "react";
import { Combobox } from "../component/command";
import { Delete } from "lucide-react";
import { Product } from "@prisma/client";

interface ProductIngredientsProps {
    Product: {
        parts?:
            | {
                  productid: string;
                  quantity: number;
                  name: string;
              }[]
            | undefined;
    };
    setProduct: React.Dispatch<
        React.SetStateAction<{
            parts?:
                | {
                      productid: string;
                      quantity: number;
                      name: string;
                  }[]
                | undefined;
        }>
    >;
    products: Product[];
}

const ProductIngredients: React.FC<ProductIngredientsProps> = ({
    Product,
    setProduct,
    products,
}) => {
    return (
        <div>
            <div>
                <label htmlFor="unit" className="font-bold ">
                    المكونات
                </label>
                <select
                    className="p-2 w-full bg-slate-100 rounded-sm "
                    onChange={(e) => {
                        const selectedProductId = e.target.value;
                        const selectedProduct = products.find(
                            (product) => product.id === selectedProductId
                        );

                        if (selectedProduct) {
                            const parts = Product.parts || [];
                            const IsItemThere = parts.find(
                                (item) => item.productid === selectedProduct.id
                            );
                            if (IsItemThere) {
                                return;
                            }
                            parts?.push({
                                name: selectedProduct?.name || "",
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
                    {products.map((product) => {
                        if (product.id === undefined) return null;
                        return (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        );
                    })}
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
                        {Product.parts?.map((part, index) => (
                            <tr key={index}>
                                <td className="w-full border-1 border-black px-3">
                                    {part.name}
                                </td>
                                <td className="border-1 border-black w-12">
                                    <input
                                        className="w-full text-center "
                                        type="number"
                                        onChange={(e) => {
                                            const newParts = Product.parts?.map(
                                                (item) => {
                                                    if (
                                                        item.productid ===
                                                        part.productid
                                                    ) {
                                                        return {
                                                            ...item,
                                                            quantity:
                                                                e.target
                                                                    .valueAsNumber,
                                                        };
                                                    } else return item;
                                                }
                                            );
                                            setProduct({
                                                ...Product,
                                                parts: newParts,
                                            });
                                        }}
                                        defaultValue={part.quantity}
                                    />
                                </td>
                                <td>
                                    <Delete
                                        onClick={() => {
                                            const updatedItems =
                                                Product.parts?.filter(
                                                    (partP) =>
                                                        part.productid !==
                                                        partP.productid
                                                );
                                            setProduct({
                                                ...Product,
                                                parts: updatedItems,
                                            });
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductIngredients;
