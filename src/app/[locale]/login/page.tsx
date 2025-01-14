import { auth } from "@/auth";
import Form from "./form";
import { redirect } from "@/i18n/routing";
import prismaDb from "@/lib/prisma";

export default async function LoginPage({
  params,
}: {
  params: { orgid: string; locale: string };
}) {
  const user = await auth();
  if (!user?.user?.id) {
    return <Form />;
  }
  const findUserInDb = await prismaDb.user.findUnique({
    where: {
      id: user?.user.id,
    },
  });
  if (findUserInDb) {
    redirect({
      href: "/",
      locale: params.locale,
    });
  }
}
