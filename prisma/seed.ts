import prismaDb from "../src/lib/prisma";
import fs from "fs";

const dataDir = "./migration-data";
// organizationId: "4d8ffc2f-3d06-41c3-8567-a71e7aad5d10",
async function importData() {
  // const customersData = JSON.parse(fs.readFileSync(`${dataDir}/returnedInvoices.json`, "utf-8"));
  // for (const customer of customersData) {
  //   await prismaDb.returnedInvoice.create({
  //     data: {
  //       id: customer.id,
  //       amount: customer.amount,
  //       customerId: customer.customerId,
  //       createdAt: new Date(customer.createdAt),
  //       updatedAt: new Date(customer.updatedAt),
  //       date: new Date(customer.date),
  //       number: customer.number,
  //       organizationId: "4d8ffc2f-3d06-41c3-8567-a71e7aad5d10",
  //     },
  //   });
  // }
  const customersData = JSON.parse(fs.readFileSync(`${dataDir}/payments.json`, "utf-8"));
  for (const customer of customersData) {
    await prismaDb.payment.create({
      data: {
        id: customer.id,
        amount: customer.amount,
        customerId: customer.customerId,
        method: customer.method,
        createdAt: new Date(customer.createdAt),
        updatedAt: new Date(customer.updatedAt),
        date: new Date(customer.date),
        invoiceId: customer.invoiceId,
        organizationId: "4d8ffc2f-3d06-41c3-8567-a71e7aad5d10",
        notes: customer.notes,
        number: customer.number,
      },
    });
  }

  console.log("Data import complete!");
}

importData().catch((e) => {
  console.error("Import error:", e);
  process.exit(1);
});
