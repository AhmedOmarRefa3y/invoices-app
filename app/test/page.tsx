import ProductionEvent from "@/components/ProductionEvent";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import prismaDb from "@/lib/prisma";
import React from "react";

const page = async () => {
    const products = await prismaDb.product.findMany();

    return (
        <div className="flex items-center z-50 relative justify-center mt-10">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"default"}
                        // className={cn("", className)}
                        className="flex-1"
                        contentEditable
                    >
                        عرض الفاتورة
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-md p-0 border-2 border-black bg-red-500 bg-opacity-0">
                    <ProductionEvent products={products} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default page;
