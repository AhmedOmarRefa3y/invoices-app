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
            setquantity(0);
            setprdouctID("");
            setPrice(0);
        }
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 items-center mt-3 justify-items-center">
            <div className=" w-full">
                <label htmlFor="">Product</label>
                <Select
                    onValueChange={(value) => {
                        setprdouctID(value);
                    }}
                    key={prdouctID}
                    value={prdouctID}
                >
                    <SelectTrigger className="">
                        <SelectValue placeholder="Select a Product" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Customer</SelectLabel>
                            {products.map((item) => (
                                <SelectItem
                                    value={item.id.toString()}
                                    key={item.name}
                                    className="text-lg"
                                >
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className=" w-full">
                <label htmlFor="">Product Price</label>
                <Input
                    className="text-center text-lg"
                    type="number"
                    value={Price}
                    disabled
                    onChange={(e) => {
                        setPrice(e.target.valueAsNumber);
                    }}
                    placeholder="Price"
                />
            </div>
            <div className=" w-full">
                <label htmlFor="">Quantity</label>
                <Input
                    className="text-center text-lg"
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    onChange={(e) => {
                        setquantity(e.target.valueAsNumber);
                    }}
                />
            </div>
            <div className="flex flex-col align-baseline  w-full h-full">
                <label htmlFor="Totalprice">Total Price</label>
                <span className=" h-full bg-green-400 text-lg flex items-center justify-center rounded-md">
                    {quantity && Price ? quantity * Price : 0}
                </span>
            </div>

            <Button
                type="button"
                onClick={addProductHandler}
                className="h-full text-lg w-full"
            >
                Add Product
            </Button>
        </div>
    );
};

export default AddProduct;
