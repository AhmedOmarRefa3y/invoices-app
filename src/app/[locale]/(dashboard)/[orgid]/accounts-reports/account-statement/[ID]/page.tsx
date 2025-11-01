import AccountStatementPage from "./CustomerData";
import type { Metadata } from "next";
import prismaDb from "@/lib/prisma";
import { Suspense } from "react";
import Loading from "@/app/[locale]/loading";

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
  params: Promise<{ ID: string; locale: string; orgid: string }>;
}) => {
  return (
    <Suspense fallback={<Loading />}>
      <AccountStatementPage params={await params} />
    </Suspense>
  );
};

export default CustomerAccount;
