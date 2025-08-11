"use server";

import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";

export async function updateOrganizationName(orgId: string, name: string) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Invalid name");
    }

    // Check if organization exists and user is the owner
    const organization = await prismaDb.organization.findFirst({
      where: {
        id: orgId,
        ownerId: session.user.id,
      },
    });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Update organization name
    const updatedOrganization = await prismaDb.organization.update({
      where: {
        id: orgId,
      },
      data: {
        name: name.trim(),
      },
    });

    return { success: true, organization: updatedOrganization };
  } catch (error) {
    console.error("[ORGANIZATION_UPDATE_ACTION]", error);
    return { success: false, error: error instanceof Error ? error.message : "Internal error" };
  }
}
