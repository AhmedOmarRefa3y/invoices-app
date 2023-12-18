import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const invoice = await prismaDb.invoice.delete({
            where: {
                id: params.id,
            },
        });

        return NextResponse.json(invoice);
    } catch (error) {
        // console.log(`[invoice delete]`, error);
        return new NextResponse("enternal Error", { status: 500 });
    }
}
