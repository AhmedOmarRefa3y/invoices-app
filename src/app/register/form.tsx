"use client";

import Register from "@/actions/register";
import { FormEvent } from "react";

export default function Form() {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await Register({
            password: formData.get("password") as string,
            userName: formData.get("email") as string,
        });
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 mx-auto max-w-md mt-10"
        >
            <input
                name="email"
                className="border border-black text-black"
                type="text"
            />
            <input
                name="password"
                className="border border-black  text-black"
                type="password"
            />
            <button type="submit">Register</button>
        </form>
    );
}
