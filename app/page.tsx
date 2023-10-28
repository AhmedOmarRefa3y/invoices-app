import SelectForm from "@/components/AddInvoice";
import Image from "next/image";
import prismaDb from "@/lib/prisma";

export default async function Home() {
    const customers = await prismaDb.customer.findMany();
    const products = await prismaDb.product.findMany();
    console.log(customers, products);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between ">
            <SelectForm customers={customers} products={products} />
        </main>
    );
}
