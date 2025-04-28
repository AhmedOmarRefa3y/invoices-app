import { TableUi } from "@/components/table";

import { INitaliListColumns, INitaliListColumnsT } from "./tableComponents/columns";
import prismaDb from "@/lib/prisma";
import EditListBtn from "./editBtn";

const page = async ({ params }: { params: { id: string; orgid: string } }) => {
  console.log(params.id);
  const list = await prismaDb.initialquantities.findUnique({
    where: {
      year: parseInt(params.id, 10),
      organizationId: params.orgid,
    },
    select: {
      products: {
        select: {
          product: {
            select: {
              id: true,
              name: true,
              unit: {
                select: {
                  name: true,
                },
              },
            },
          },
          quantity: true,
        },
      },
      year: true,
      date: true,
      id: true,
    },
  });
  if (!list) return <div>Data not found</div>;
  const Items: INitaliListColumnsT[] = [];
  list?.products.map((item) => {
    return Items.push({
      productName: item.product.name,
      id: item.product.id,
      initalQuantity: item.quantity,
      unit: item.product.unit?.name as string,
    });
  });

  return (
    <div>
      <TableUi
        columns={INitaliListColumns}
        data={Items}
        filterAccessorKey="productName"
        filterlabel="Product Name"
        filterplaceholder="Search for product"
        notfound="No product found with this name"
        visabilty={true}
      />
      <EditListBtn
        items={Items.map((item) => {
          return {
            id: item.id,
            name: item.productName,
            Quantity: item.initalQuantity,
            unit: item.unit,
          };
        })}
        id={list ? list?.id : ""}
      />
    </div>
  );
};

export default page;
