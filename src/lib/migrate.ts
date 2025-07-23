"use server";
import prismaDb from "@/lib/prisma";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

export async function migrate() {
  try {
    // Get the current authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("You must be logged in to migrate data");
    }

    // Get user's organizations
    const userOrgs = await prismaDb.organization.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    if (userOrgs.length === 0) {
      throw new Error("You need to create an organization first");
    }

    const orgId = userOrgs[0].id; // Using the first organization

    // First, delete all existing products for this organization
    const deletedProducts = await prismaDb.product.deleteMany({
      where: {
        organizationId: orgId,
      },
    });

    console.log(`Deleted ${deletedProducts.count} existing products`);

    // Read the JSON file
    const filePath = path.join(process.cwd(), "src", "lib", "fullExportedData.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Check if products exist in the JSON
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("No products found in the JSON file");
    }

    // Create default category and unit if they don't exist
    let defaultCategory = await prismaDb.catgories.findFirst({
      where: { organizationId: orgId },
    });

    if (!defaultCategory) {
      defaultCategory = await prismaDb.catgories.create({
        data: {
          name: "Default Category",
          organizationId: orgId,
        },
      });
    }

    let defaultUnit = await prismaDb.units.findFirst({
      where: { organizationId: orgId },
    });

    if (!defaultUnit) {
      defaultUnit = await prismaDb.units.create({
        data: {
          name: "Default Unit",
          organizationId: orgId,
        },
      });
    }

    // Import products
    const importedProducts = await Promise.all(
      data.products.map(async (product: any) => {
        // Create the product with original ID
        return prismaDb.product.create({
          data: {
            id: product.id, // Preserve original ID
            name: product.name,
            price: product.price || 0,
            initialquantity: product.initialquantity || 0,
            isAcomopsition: product.isAcomopsition || false,
            catgoryId: defaultCategory.id,
            unitId: defaultUnit.id,
            organizationId: orgId,
          },
        });
      })
    );

    // Import customers if they exist in the JSON
    let importedCustomers = [];
    if (data.customers && Array.isArray(data.customers)) {
      // Delete existing customers
      await prismaDb.customer.deleteMany({
        where: {
          organizationId: orgId,
        },
      });

      importedCustomers = await Promise.all(
        data.customers.map(async (customer: any) => {
          return prismaDb.customer.create({
            data: {
              id: customer.id,
              name: customer.name,
              phoneNumber: customer.phoneNumber || "",
              location: customer.location || "",
              CustomerCredit: customer.CustomerCredit || 0,
              organizationId: orgId,
              createdAt: customer.createdAt ? new Date(customer.createdAt) : new Date(),
              updatedAt: customer.updatedAt ? new Date(customer.updatedAt) : new Date(),
            },
          });
        })
      );
      console.log(`Imported ${importedCustomers.length} customers`);
    }

    // Import invoices if they exist in the JSON
    let importedInvoices = [];
    if (data.invoices && Array.isArray(data.invoices)) {
      // Delete existing invoices
      await prismaDb.invoice.deleteMany({
        where: {
          organizationId: orgId,
        },
      });

      importedInvoices = await Promise.all(
        data.invoices.map(async (invoice: any) => {
          return prismaDb.invoice.create({
            data: {
              id: invoice.id,
              number: invoice.number,
              date: invoice.date ? new Date(invoice.date) : new Date(),
              amount: invoice.amount || 0,
              customerId: invoice.customerId,
              organizationId: orgId,
              createdAt: invoice.createdAt ? new Date(invoice.createdAt) : new Date(),
              updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt) : new Date(),
            },
          });
        })
      );
      console.log(`Imported ${importedInvoices.length} invoices`);
    }

    // Import line items if they exist in the JSON
    let importedLineItems = [];
    if (data.lineItems && Array.isArray(data.lineItems)) {
      // Delete existing line items
      await prismaDb.lineItem.deleteMany({
        where: {
          organizationId: orgId,
        },
      });

      importedLineItems = await Promise.all(
        data.lineItems.map(async (lineItem: any) => {
          return prismaDb.lineItem.create({
            data: {
              id: lineItem.id,
              amount: lineItem.amount || null,
              quantity: lineItem.quantity || 0,
              price: lineItem.price || null,
              ItemNumber: lineItem.ItemNumber || 0,
              productId: lineItem.productId,
              invoiceId: lineItem.invoiceId || null,
              returnedInvoiceId: lineItem.returnedInvoiceId || null,
              productionEventId: lineItem.productionEventId || null,
              isProduction: lineItem.isProduction || false,
              isReduction: lineItem.isReduction || false,
              productionPlanId: lineItem.productionPlanId || null,
              initialquantitiesId: lineItem.initialquantitiesId || null,
              purchaseInvoiceId: lineItem.purchaseInvoiceId || null,
              organizationId: orgId,
              createdAt: lineItem.createdAt ? new Date(lineItem.createdAt) : new Date(),
              updatedAt: lineItem.updatedAt ? new Date(lineItem.updatedAt) : new Date(),
            },
          });
        })
      );
      console.log(`Imported ${importedLineItems.length} line items`);
    }

    // Import order items if they exist in the JSON
    let importedOrderItems = [];
    if (data.orderItems && Array.isArray(data.orderItems)) {
      // Delete existing order items
      await prismaDb.orderItem.deleteMany({
        where: {
          organizationId: orgId,
        },
      });

      importedOrderItems = await Promise.all(
        data.orderItems.map(async (orderItem: any) => {
          return prismaDb.orderItem.create({
            data: {
              id: orderItem.id,
              quantity: orderItem.quantity || 0,
              amount: orderItem.amount || 0,
              price: orderItem.price || 0,
              productId: orderItem.productId,
              invoiceId: orderItem.invoiceId || null,
              returnedInvoiceId: orderItem.returnedInvoiceId || null,
              OrderNumber: orderItem.OrderNumber || 0,
              organizationId: orgId,
            },
          });
        })
      );
      console.log(`Imported ${importedOrderItems.length} order items`);
    }

    return {
      status: "success",
      message: `Data migration completed successfully. 
        Imported ${importedProducts.length} products, 
        ${importedCustomers.length} customers, 
        ${importedInvoices.length} invoices, 
        ${importedLineItems.length} line items, and 
        ${importedOrderItems.length} order items.`,
    };
  } catch (error) {
    console.error("Migration error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "An unknown error occurred during migration",
    };
  }
}
