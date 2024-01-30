"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";
export async function DbEdit() {
    console.log("edit db run");
    revalidateApp();
}
