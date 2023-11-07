import AddInvoiceFrom from "@/components/addInvoice/AddInvoice";
import prismaDb from "@/lib/prisma";

export default async function Home() {
    const customers = await prismaDb.customer.findMany();
    const products = await prismaDb.product.findMany();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between ">
            <AddInvoiceFrom customers={customers} products={products} />
        </main>
    );
}
