import { auth } from "@/auth";
import prismaDb from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;
    const { name } = await req.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new NextResponse("Invalid name", { status: 400 });
    }

    // Check if organization exists and user is the owner
    const organization = await prismaDb.organization.findFirst({
      where: {
        id,
        ownerId: session.user.id,
      },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    // Update organization name
    const updatedOrganization = await prismaDb.organization.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedOrganization);
  } catch (error) {
    console.error("[ORGANIZATION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}