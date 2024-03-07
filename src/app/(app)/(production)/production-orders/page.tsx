import { TableUi } from "@/components/table";
import {
    ProductionsTableColumns,
    ProductionsTableT,
} from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";

const ShowProdcutions = async () => {
    const Prddctions = await prismaDb.productionEvent.findMany({
        include: {
            lineItems: true,
        },
    });
    const FormatedPrddctions: ProductionsTableT[] = Prddctions.map(
        (item, i) => {
            return {
                id: item.id,
                number: i + 1,
                date: item.createdAt,
                CreatedAt: item.createdAt,
            };
        }
    );

    return (
        <div className="flex relative gap-2 overflow-x-clip ">
            <div className="basis-[100%] xl:basis-[75%] p-2">
                <TableUi
                    columns={ProductionsTableColumns}
                    data={FormatedPrddctions}
                    filterAccessorKey="customerName"
                    filterlabel="اسم العميل"
                    filterplaceholder="ابحث عن العميل بالاسم"
                    notfound="لا يوجد فواتير متاحة"
                    reversedNavButton={true}
                />
            </div>
            <div className="xl:basis-[25%]"></div>
        </div>
    );
};

export default ShowProdcutions;
