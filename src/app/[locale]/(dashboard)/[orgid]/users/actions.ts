"use server";

import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidateApp } from "@/actions";

export async function getUsersByOrganization(orgId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify that the user has access to this organization
    const orgUser = await prismaDb.organizationUser.findFirst({
      where: {
        organizationId: orgId,
        userId: session.user.id,
      },
    });

    if (!orgUser) {
      throw new Error("Unauthorized access to organization");
    }

    const users = await prismaDb.organizationUser.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return users.map((orgUser) => ({
      id: orgUser.user.id,
      name: orgUser.user.name,
      email: orgUser.user.email,
      role: orgUser.role,
      createdAt: orgUser.user.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching users by organization:", error);
    throw error;
  }
}

export async function getRolesByOrganization(orgId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify that the user has access to this organization
    const orgUser = await prismaDb.organizationUser.findFirst({
      where: {
        organizationId: orgId,
        userId: session.user.id,
      },
    });

    if (!orgUser) {
      throw new Error("Unauthorized access to organization");
    }

    const roles = await prismaDb.role.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return roles;
  } catch (error) {
    console.error("Error fetching roles by organization:", error);
    throw error;
  }
}

export async function getAllUsersNotInOrganization(orgId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get all users already in the organization
    const orgUsers = await prismaDb.organizationUser.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        userId: true,
      },
    });

    const userIdsInOrg = orgUsers.map(ou => ou.userId);
    
    // Get all users not in the organization
    const users = await prismaDb.user.findMany({
      where: {
        id: {
          notIn: userIdsInOrg,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users not in organization:", error);
    throw error;
  }
}

export async function updateUserRole(userId: string, organizationId: string, roleId: string | null) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify that the user has permission to manage roles
    const currentUserOrg = await prismaDb.organizationUser.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!currentUserOrg || !currentUserOrg.role) {
      throw new Error("Unauthorized access to organization");
    }

    // Check if user has MANAGE_USERS permission
    const hasPermission = currentUserOrg.role.permissions.some(
      rp => rp.permission.name === "MANAGE_USERS"
    );

    if (!hasPermission) {
      throw new Error("You do not have permission to manage users");
    }

    const updatedOrgUser = await prismaDb.organizationUser.update({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId,
        },
      },
      data: {
        roleId: roleId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    await revalidateApp();

    return updatedOrgUser;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function addUserToOrganization(userId: string, organizationId: string, roleId: string | null) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify that the user has permission to add users
    const currentUserOrg = await prismaDb.organizationUser.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!currentUserOrg || !currentUserOrg.role) {
      throw new Error("Unauthorized access to organization");
    }

    // Check if user has MANAGE_USERS permission
    const hasPermission = currentUserOrg.role.permissions.some(
      rp => rp.permission.name === "MANAGE_USERS"
    );

    if (!hasPermission) {
      throw new Error("You do not have permission to add users to organization");
    }

    const newUser = await prismaDb.organizationUser.create({
      data: {
        userId: userId,
        organizationId: organizationId,
        roleId: roleId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    await revalidateApp();

    return newUser;
  } catch (error) {
    console.error("Error adding user to organization:", error);
    throw error;
  }
}

export async function removeUserFromOrganization(userId: string, organizationId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Verify that the user has permission to remove users
    const currentUserOrg = await prismaDb.organizationUser.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!currentUserOrg || !currentUserOrg.role) {
      throw new Error("Unauthorized access to organization");
    }

    // Check if user has MANAGE_USERS permission
    const hasPermission = currentUserOrg.role.permissions.some(
      rp => rp.permission.name === "MANAGE_USERS"
    );

    if (!hasPermission) {
      throw new Error("You do not have permission to remove users from organization");
    }

    // Prevent users from removing themselves
    if (userId === session.user.id) {
      throw new Error("You cannot remove yourself from the organization");
    }

    // Delete the organizationUser record
    await prismaDb.organizationUser.delete({
      where: {
        userId_organizationId: {
          userId: userId,
          organizationId: organizationId,
        },
      },
    });

    await revalidateApp();

    return { success: true };
  } catch (error) {
    console.error("Error removing user from organization:", error);
    throw error;
  }
}