import { auth } from "auth";
import Form from "./form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const user = await auth();
    if (user) {
        redirect("/");
    }
    return <Form />;
}
