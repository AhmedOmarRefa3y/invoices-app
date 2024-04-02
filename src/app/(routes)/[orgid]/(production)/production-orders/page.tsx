import { TableUi } from "@/components/table";
import {
    ProductionsTableColumns,
    ProductionsTableT,
} from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";

const ShowProdcutions = async ({ params }: { params: { orgid: string } }) => {
    const organization = await prismaDb.organization.findUnique({
        where: {
            id: params.orgid,
        },
        include: {
            ProductionEvent: {
                include: {
                    lineItems: true,
                },
            },
        },
    });

    const FormatedPrddctions: ProductionsTableT[] | [] =
        organization?.ProductionEvent.map((item, i) => {
            return {
                id: item.id,
                number: i + 1,
                date: item.createdAt,
                CreatedAt: item.createdAt,
                orgID: params.orgid,
            };
        }) || [];

    return (
        <div className="w-full">
            <div className=" p-2 mt-7 w-fit mx-auto">
                <TableUi
                    columns={ProductionsTableColumns}
                    data={FormatedPrddctions}
                    filterAccessorKey="customerName"
                    filterEnabled={false}
                    filterlabel="اسم العميل"
                    filterplaceholder="ابحث عن العميل بالاسم"
                    notfound="لا يوجد اوامر انتاج"
                    reversedNavButton={true}
                />
            </div>
        </div>
    );
};

export default ShowProdcutions;
