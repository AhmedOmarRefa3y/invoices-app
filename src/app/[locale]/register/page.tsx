import { auth } from "@/auth";
import Form from "./form";
import { redirect } from "@/i18n/routing";

export default async function RegisterPage() {
  const user = await auth();
  if (user?.user?.id) {
    redirect("/");
  }
  return <Form />;
}
