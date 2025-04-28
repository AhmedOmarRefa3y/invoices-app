"use server";
import { revalidateApp } from "./customer";
export async function DbEdit() {
  revalidateApp();
}
