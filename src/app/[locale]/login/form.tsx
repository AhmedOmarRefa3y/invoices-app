"use client";

import { useRouter } from "@/i18n/routing";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import logo from "@/public/logo.png";
import { Spinner } from "@/components/loadingComp";
import { KeyIcon, User2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { signInAction } from "@/actions/signin";

export default function Form() {
  const router = useRouter();
  const [error, seterror] = useState<string | undefined>(undefined);
  const [loading, setloading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setloading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signInAction({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (response.status === "ok") {
      setloading(true);
      seterror(undefined);
      router.push("/");
      router.refresh();
    } else {
      setloading(false);
      seterror("Username or password is wrong");
      toast.error("Username or password is wrong");
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
          <label htmlFor="email" className=" font-bold   my-1">
            Email
          </label>
          <div
            className="flex w-full border justify-between items-center"
            dir="ltr"
          >
            <input
              name="email"
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
            Password
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
            className="hover:bg-slate-950/70 ml-2  py-6  mt-2 mx-auto rounded-none w-full text-lg"
          >
            Sign In
          </Button>
          <Button
            type="button"
            onClick={() => {
              signIn("google");
              setloading(true);
            }}
            className="hover:bg-slate-950/70 ml-2 py-6  mt-2 mx-auto rounded-none w-full text-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <span className="px-2">Continue with Google </span>
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
