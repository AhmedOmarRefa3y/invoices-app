import React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/Select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useInvoice from "@/lib/zustand";
import { Product } from "@prisma/client";

interface AddProductProps {
    products: Product[];
}
const AddProduct: React.FC<AddProductProps> = ({ products }) => {
    const invoice = useInvoice();
    const [prdouctID, setprdouctID] = React.useState<string>();
    const [quantity, setquantity] = React.useState<number>(0);
    const [Price, setPrice] = React.useState<number>(0);
    // set Price
    React.useEffect(() => {
        const product = products.find((item) => item.id == prdouctID);
        const priceAsNumber = product ? Number(product.price) : 0; // Convert to a number or use 0 as a default value
        setPrice(priceAsNumber);
    }, [prdouctID]);

    const addProductHandler = () => {
        const product = products.find((item) => item.id == prdouctID);
        if (product) {
            invoice.addItem({
                id: product?.id,
                name: product?.name,
                price: product.price,
                quantity: quantity,
            });
        }
    };
    return (
        <div className="w-full">
            <div className="mt-3 flex flex-col items-center ">
                <div className=" flex items-center gap-6  ">
                    <div>
                        <label htmlFor="">Product</label>
                        <Select
                            onValueChange={(value) => {
                                setprdouctID(value);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Customer</SelectLabel>
                                    {products.map((item) => (
                                        <SelectItem
                                            value={item.id.toString()}
                                            key={item.name}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="">Quantity</label>
                        <Input
                            type="number"
                            value={quantity}
                            placeholder="Quantity"
                            onChange={(e) => {
                                setquantity(e.target.valueAsNumber);
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="">price</label>
                        <Input
                            type="number"
                            value={Price}
                            onChange={(e) => {
                                setPrice(e.target.valueAsNumber);
                            }}
                            placeholder="Price"
                        />
                    </div>
                    <div>
                        <label htmlFor="Totalprice">Totalprice</label>
                        <span className="flex items-center w-fit px-4 h-full rounded-md bg-red-300">
                            {quantity && Price ? quantity * Price : 0}
                        </span>
                    </div>
                </div>
            </div>
            <Button type="button" onClick={addProductHandler}>
                Add Product
            </Button>
        </div>
    );
};

export default AddProduct;
