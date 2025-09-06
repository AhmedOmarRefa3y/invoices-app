import AccountStatementPage from "./CustomerData";
import type { Metadata } from "next";
import prismaDb from "@/lib/prisma";
import ViewPaymentModal from "@/components/modals/viewPaymentModal";

type Props = {
  params: Promise<{ ID: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

const CustomerAccount = async ({
  params,
}: {
  params: { orgid: string; ID: string; locale: string };
}) => {
  return (
    <>
      <AccountStatementPage params={params} />
      <ViewPaymentModal />
    </>
  );
};

export default CustomerAccount;
