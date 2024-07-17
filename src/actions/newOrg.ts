"use server";

import prismaDb from "@/lib/prisma";
import { revalidateApp } from "./customer";
import { auth } from "@/auth";

export async function CreateOrg(Data: { OrgName: string }) {
    const user = await auth();

    try {
        if (!Data.OrgName) {
            throw new Error("Org Name is required");
        }
        if (!user?.user?.id) {
            throw new Error("user id is required");
        }
        const NewOrg = await prismaDb.organization.create({
            data: {
                name: Data.OrgName,
                owner: {
                    connect: {
                        id: user?.user.id,
                    },
                },
            },
        });
        if (!NewOrg) {
            throw new Error("Failed to create NewOrg");
        }
        revalidateApp();
        return {
            status: "ok",
            message: "NewOrg created successfully",
            Data: NewOrg,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating NewOrg",
        };
    }
}
export async function CreateUnit(Data: { UnitName: string; orgID: string }) {
    try {
        if (!Data.orgID) {
            throw new Error("orgID is required");
        }
        if (!Data.UnitName) {
            throw new Error("Unit Name is required");
        }
        const NewUnit = await prismaDb.units.create({
            data: {
                name: Data.UnitName,
                organizationId: Data.orgID,
            },
        });
        if (!NewUnit) {
            throw new Error("Failed to create Unit");
        }
        revalidateApp();
        return {
            status: "ok",
            message: "Unit created successfully",
            Data: NewUnit,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating new Unit",
        };
    }
}
export async function CreateInventory(Data: {
    InventoryName: string;
    orgID: string;
}) {
    try {
        if (!Data.orgID) {
            throw new Error("orgID is required");
        }
        if (!Data.InventoryName) {
            throw new Error("Inventory Name is required");
        }
        const NewInventory = await prismaDb.catgories.create({
            data: {
                name: Data.InventoryName,
                organizationId: Data.orgID,
            },
        });
        if (!NewInventory) {
            throw new Error("Failed to create New Inventory");
        }
        revalidateApp();
        return {
            status: "ok",
            message: "New Inventory created successfully",
            Data: NewInventory,
        };
    } catch (error) {
        return {
            status: "error",
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating New Inventory",
        };
    }
}
