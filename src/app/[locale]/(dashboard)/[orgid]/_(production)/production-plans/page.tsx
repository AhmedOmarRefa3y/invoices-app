import { TableUi } from "@/components/table";
import { ProductionPlansT, ProductionPlansTColumns } from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";

const ShowProdcutions = async ({ params }: { params: Promise<{ orgid: string }> }) => {
  const { orgid } = await params;
  const organization = await prismaDb.organization.findUnique({
    where: {
      id: orgid,
    },
    include: {
      ProductionPlan: {
        include: {
          lineItems: true,
          ProductionEvents: {
            include: {
              lineItems: true,
            },
          },
        },
      },
    },
  });
  const FormatedProductionPlans: ProductionPlansT[] =
    organization?.ProductionPlan.map((item, i) => {
      let Items = 0;
      let producedItems = 0;
      item.ProductionEvents.forEach((event) => {
        event.lineItems.map((item) => (producedItems = +item.quantity));
      });
      item.lineItems.map((item) => (Items = +item.quantity));

      return {
        id: item.id,
        number: i + 1,
        date: item.createdAt,
        CreatedAt: item.createdAt,
        orgID: orgid,
        done: ((producedItems / Items) * 100).toFixed(0),
      };
    }) || [];

  return (
    <div className="mx-auto w-fit p-2 mt-10">
      <TableUi
        columns={ProductionPlansTColumns}
        data={FormatedProductionPlans}
        filterEnabled={false}
        notfound="No production plans available"
        reversedNavButton={true}
      />
    </div>
  );
};

export default ShowProdcutions;
