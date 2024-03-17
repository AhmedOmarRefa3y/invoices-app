"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import "../globals.css";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import bgIamge from "../../../public/bg2.svg";
import Register from "@/actions/register";

import { signIn } from "next-auth/react";
import { Spinner } from "@chakra-ui/react";

export default function RegisterForm() {
    const router = useRouter();
    const [error, seterror] = useState<string | undefined>(undefined);
    const [loading, setloading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setloading(true);
        e.preventDefault();
        // console.log(e.currentTarget);
        const formData = new FormData(e.currentTarget);
        // console.log(formData.get("userName"));
        // return;
        const response = await Register({
            userName: formData.get("userName") as string,
            password: formData.get("password") as string,
        });

        // console.log({ response });
        if (response?.status === "ok") {
            setloading(true);
            seterror(undefined);
            router.push("/");
            router.refresh();
        } else {
            setloading(false);
            // console.log(response.message);
            if (response.message === "username already exist") {
                toast.error("اسم المستخدم غير متاح");
                seterror("اسم المستخدم غير متاح");
            } else {
                toast.error(response.message);
            }
        }
    };
    return (
        <div className="realtive h-screen flex w-full flex-col justify-center items-center bg-transparent">
            <div className="absolute inset-0 max-h-screen overflow-hidden">
                <Image src={bgIamge} alt={"bg"} className="object-none" />
            </div>
            <form
                onSubmit={handleSubmit}
                className="  flex w-full z-10  flex-col justify-center items-center backdrop-blur-sm	 border-black gap-2 mx-auto max-w-md  bg-slate-300/20 h duration-250 p-5 shadow-gray-600  shadow-2xl rounded-lg"
            >
                {error && <p className="text-red-500 text-lg ">{error}</p>}
                <div className="flex flex-col">
                    <label
                        htmlFor="userName"
                        className=" font-bold text-2xl text-white my-1"
                    >
                        اسم المستخدم
                    </label>
                    <input
                        name="userName"
                        className=" outline-none border-3 focus:border-blue-600 duration-300 text-3xl  p-1 px-3 rounded rtl:text-left"
                        type="text"
                    />
                </div>
                <div className="flex flex-col">
                    <label
                        htmlFor="password"
                        className=" font-bold  text-2xl text-white "
                    >
                        كلمة المرور
                    </label>
                    <input
                        name="password"
                        className=" outline-none border-3 focus:border-blue-600 duration-300 text-3xl  p-1 px-3 rounded rtl:text-left my-1"
                        type="password"
                    />
                </div>
                <div className="flex relative w-fit">
                    <Button
                        type="submit"
                        className="hover:bg-slate-950/70 ml-2 text-2xl mt-2 mx-auto"
                    >
                        تسجيل
                    </Button>
                    {loading && (
                        <Spinner
                            color="red.500"
                            size="xl"
                            className="absolute -left-14"
                        />
                    )}
                </div>
            </form>
        </div>
    );
}
