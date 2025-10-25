import { TableUi } from "@/components/table";
import { ProductionsTableColumns, ProductionsTableT } from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";

const ShowProdcutions = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  const { orgid } = await params;
  const organization = await prismaDb.organization.findUnique({
    where: {
      id: orgid,
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
        orgID: orgid,
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
          filterlabel="Customer Name"
          filterplaceholder="Search customer by name"
          notfound="No production orders found"
          reversedNavButton={true}
        />
      </div>
    </div>
  );
};

export default ShowProdcutions;
