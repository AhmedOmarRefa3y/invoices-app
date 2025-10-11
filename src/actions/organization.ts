"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateApp } from "@/actions";
import { createMainLedgerAccountsForOrg } from "@/actions/CreateLedgerAccounts";

export async function CreateOrg(Data: { OrgName: string }) {
  const user = await auth();

  try {
    if (!Data.OrgName) {
      throw new Error("Org Name is required");
    }
    if (!user?.user?.id) {
      throw new Error("user id is required");
    }

    const result = await prismaDb.$transaction(async (tx) => {
      const NewOrg = await tx.organization.create({
        data: {
          name: Data.OrgName,
          owner: {
            connect: { id: user?.user?.id },
          },
        },
      });
      const roles = await tx.role.createMany({
        data: [
          { name: "Admin", organizationId: NewOrg.id },
          { name: "Sales", organizationId: NewOrg.id },
          { name: "Accountant", organizationId: NewOrg.id },
        ],
      });
      const allPermissions = await tx.permission.findMany();
      const adminRole = await tx.role.findFirst({
        where: { name: "Admin", organizationId: NewOrg.id },
      });
      const salesRole = await tx.role.findFirst({
        where: { name: "Sales", organizationId: NewOrg.id },
      });
      const accountantRole = await tx.role.findFirst({
        where: { name: "Accountant", organizationId: NewOrg.id },
      });

      // Admin → كل الصلاحيات
      await tx.rolePermission.createMany({
        data: allPermissions.map((perm) => ({
          roleId: adminRole!.id,
          permissionId: perm.id,
        })),
      });

      // Sales → صلاحيات محددة
      const salesPermissions = allPermissions.filter((p) =>
        ["CREATE_INVOICE", "EDIT_INVOICE"].includes(p.name)
      );
      await tx.rolePermission.createMany({
        data: salesPermissions.map((perm) => ({
          roleId: salesRole!.id,
          permissionId: perm.id,
        })),
      });

      // Accountant → تقارير فقط
      const accountantPermissions = allPermissions.filter((p) => ["VIEW_REPORTS"].includes(p.name));
      await tx.rolePermission.createMany({
        data: accountantPermissions.map((perm) => ({
          roleId: accountantRole!.id,
          permissionId: perm.id,
        })),
      });

      await tx.organizationUser.create({
        data: {
          organizationId: NewOrg.id,
          userId: user?.user?.id!,
          roleId: adminRole!.id,
        },
      });
      await createMainLedgerAccountsForOrg(NewOrg.id, tx);

      return NewOrg;
    });

    await revalidateApp();

    return {
      status: "ok",
      message: "✅ New organization and ledger accounts created successfully",
      Data: result,
    };
  } catch (error) {
    console.error("❌ Error creating org:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while creating organization",
    };
  }
}
