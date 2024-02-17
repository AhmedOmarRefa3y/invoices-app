"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";

export default function Form() {
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(formData.get("userName"));
        const response = await signIn("credentials", {
            userName: formData.get("userName"),
            password: formData.get("password"),
            redirect: false,
        });

        console.log({ response });
        if (!response?.error) {
            router.push("/");
            router.refresh();
        }
    };
    return (
        <div className="h-screen flex w-full flex-col justify-center items-center ">
            <form
                onSubmit={handleSubmit}
                className=" flex w-full flex-col justify-center items-center  border-black gap-2 mx-auto max-w-md  bg-slate-300 p-5 shadow-gray-600  shadow-2xl rounded-lg"
            >
                <div className="flex flex-col">
                    <label htmlFor="userName" className="font-bold text-lg">
                        اسم المستخدم
                    </label>
                    <input
                        name="userName"
                        className="border  p-1 rounded rtl:text-left"
                        type="text"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="font-bold text-lg">
                        كلمة المرور
                    </label>
                    <input
                        name="password"
                        className="border  p-1 rounded rtl:text-left"
                        type="password"
                    />
                </div>
                <Button type="submit" className="hover:bg-slate-950/70">
                    تسجيل الدخول
                </Button>
            </form>
        </div>
    );
}
