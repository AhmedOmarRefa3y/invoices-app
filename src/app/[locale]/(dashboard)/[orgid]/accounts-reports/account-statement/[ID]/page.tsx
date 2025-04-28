import AccountStatementPage from "./CustomerData";
import type { Metadata, ResolvingMetadata } from "next";
import prismaDb from "@/lib/prisma";
type Props = {
  params: Promise<{ ID: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).ID;

  // fetch data
  const Customer = await prismaDb.customer.findFirst({
    where: {
      id: id,
    },
    select: {
      name: true,
    },
  });

  return {
    title: Customer?.name + " Account",
  };
}

const CustomerAccount = async ({ params }: { params: { orgid: string; ID: string } }) => {
  return <AccountStatementPage params={params} />;
};

export default CustomerAccount;
