"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/public/logo.png";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/loadingComp";
import { KeyIcon, User, User2Icon, UserSquare2 } from "lucide-react";

export default function Form() {
    const router = useRouter();
    const [error, seterror] = useState<string | undefined>(undefined);
    const [loading, setloading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setloading(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await signIn("credentials", {
            userName: formData.get("userName"),
            password: formData.get("password"),
            redirect: false,
        });

        // console.log({ response });
        if (!response?.error) {
            setloading(true);
            seterror(undefined);
            router.push("/");
            router.refresh();
        } else {
            setloading(false);
            // console.log(response);
            seterror("اسم المستخدم او كلمة المرور غير صحيحة");
            toast.error("اسم المستخدم او كلمة المرور غير صحيحة");
        }
    };
    return (
        <div className="realtive h-screen flex w-full flex-col justify-center items-center text-black bg-[#fafafa]  p-2">
            <form
                onSubmit={handleSubmit}
                className="  flex w-full z-10  flex-col justify-center items-center	  gap-2 mx-auto max-w-md  bg-white  duration-250 p-5 shadow-md border border-stone-300"
            >
                <Image src={logo} height={100} width={100} alt="bgImage" />
                {error && <p className="text-red-500  ">{error}</p>}
                <div className="flex flex-col w-full">
                    <label htmlFor="userName" className=" font-bold   my-1">
                        اسم المستخدم
                    </label>
                    <div
                        className="flex w-full border justify-between items-center"
                        dir="ltr"
                    >
                        <input
                            name="userName"
                            className=" outline-none border-3 focus:bg-yellow-100 duration-300 flex-1   p-1 px-3 rounded rtl:text-left"
                            type="text"
                        />
                        <div className="w-7 px-1 bg-gray-200 h-full flex items-center justify-center  font-light ">
                            <User2Icon className="w-full h-full" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <label htmlFor="password" className=" font-bold    ">
                        كلمة المرور
                    </label>

                    <div
                        className="flex w-full border justify-between items-center"
                        dir="ltr"
                    >
                        <input
                            name="password"
                            className=" outline-none border-3 focus:bg-yellow-100 duration-300 flex-1   p-1 px-3 rounded rtl:text-left"
                            type="password"
                        />
                        <div className="w-7 bg-gray-200 h-full px-1 flex items-center justify-center  font-light ">
                            <KeyIcon className="w-full h-full" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 relative  w-full">
                    <Button
                        type="submit"
                        className="hover:bg-slate-950/70 ml-2  mt-2 mx-auto rounded-none w-full text-lg"
                    >
                        تسجيل الدخول
                    </Button>
                    {loading ? (
                        <span className=" h-full flex items-center justify-center">
                            <Spinner className="w-10 h-10 fill-green-500 " />
                        </span>
                    ) : (
                        <div className=" h-10" />
                    )}
                </div>
            </form>
        </div>
    );
}
