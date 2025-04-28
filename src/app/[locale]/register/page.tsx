import { auth } from "@/auth";
import Form from "./form";
import { redirect } from "@/i18n/routing";

export default async function RegisterPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const user = await auth();
  if (user?.user?.id) {
    redirect({ href: "/", locale: locale });
  }
  return <Form />;
}
