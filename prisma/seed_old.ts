import prismaDb from "../src/lib/prisma";
import fs from "fs";

const organizationId = "76dce245-8d75-41e0-9ed2-bcdcde2e600a";
const dataDir = "./migration-data";
async function importData() {
  // await prismaDb.lineItem.deleteMany();
  // await prismaDb.catgories.deleteMany();
  // await prismaDb.product.deleteMany();
  // await prismaDb.invoice.deleteMany();
  // await prismaDb.initialquantities.deleteMany();
  // await prismaDb.part.deleteMany();
  // await prismaDb.payment.deleteMany();
  // await prismaDb.orderItem.deleteMany();

  // await prismaDb.customer.deleteMany();
  // const customersData = JSON.parse(fs.readFileSync(`${dataDir}/customers.json`, "utf-8"));
  // for (const customer of customersData) {
  //   await prismaDb.customer.create({
  //     data: {
  //       id: customer.id,
  //       name: customer.name,
  //       phoneNumber: customer.phoneNumber,
  //       location: customer.location,
  //       CustomerCredit: customer.CustomerCredit,
  //       createdAt: new Date(customer.createdAt),
  //       updatedAt: new Date(customer.updatedAt),
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  // await prismaDb.catgories.deleteMany();
  // const catgoriesData = JSON.parse(fs.readFileSync(`${dataDir}/catgories.json`, "utf-8"));
  // for (const item of catgoriesData) {
  //   await prismaDb.catgories.create({
  //     data: {
  //       id: item.id,
  //       name: item.name,
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  // await prismaDb.units.deleteMany();
  // const units = JSON.parse(fs.readFileSync(`${dataDir}/units.json`, "utf-8"));
  // for (const item of units) {
  //   await prismaDb.units.create({
  //     data: {
  //       id: item.id,
  //       name: item.name,
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  // await prismaDb.product.deleteMany();
  // const products = JSON.parse(fs.readFileSync(`${dataDir}/products.json`, "utf-8"));
  // for (const item of products) {
  //   await prismaDb.product.create({
  //     data: {
  //       id: item.id,
  //       code: item.code,
  //       name: item.name,
  //       price: item.price,
  //       catgoryId: item.catgoryId,
  //       unitId: item.unitId,
  //       createdAt: new Date(item.createdAt),
  //       updatedAt: new Date(item.updatedAt),
  //       isAcomopsition: item.isAcomopsition,
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  // await prismaDb.invoice.deleteMany();
  // const invoices = JSON.parse(fs.readFileSync(`${dataDir}/invoices.json`, "utf-8"));
  // for (const item of invoices) {
  //   await prismaDb.invoice.create({
  //     data: {
  //       id: item.id,
  //       number: item.number,
  //       date: new Date(item.date),
  //       amount: item.amount,
  //       customerId: item.customerId,
  //       createdAt: new Date(item.createdAt),
  //       updatedAt: new Date(item.updatedAt),
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  // await prismaDb.returnedInvoice.deleteMany();
  // const returnedInvoices = JSON.parse(fs.readFileSync(`${dataDir}/returnedInvoices.json`, "utf-8"));
  // for (const item of returnedInvoices) {
  //   await prismaDb.returnedInvoice.create({
  //     data: {
  //       id: item.id,
  //       number: item.number,
  //       date: new Date(item.date),
  //       amount: item.amount,
  //       customerId: item.customerId,
  //       createdAt: new Date(item.createdAt),
  //       updatedAt: new Date(item.updatedAt),
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  await prismaDb.lineItem.deleteMany();
  const lineItems = JSON.parse(fs.readFileSync(`${dataDir}/lineItems.json`, "utf-8"));
  for (const item of lineItems) {
    await prismaDb.lineItem.create({
      data: {
        id: item.id,
        amount: item.amount,
        quantity: item.quantity,
        price: item.price,
        ItemNumber: item.ItemNumber,
        productId: item.productId,
        invoiceId: item.invoiceId,
        returnedInvoiceId: item.returnedInvoiceId,
        productionEventId: item.productionEventId,
        isProduction: item.isProduction,
        isReduction: item.isReduction,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        productionPlanId: null,
        organizationId: organizationId,
      },
    });
  }

  await prismaDb.orderItem.deleteMany();
  const orderItems = JSON.parse(fs.readFileSync(`${dataDir}/orderItems.json`, "utf-8"));
  for (const item of orderItems) {
    await prismaDb.orderItem.create({
      data: {
        id: item.id,
        quantity: item.quantity,
        amount: item.amount,
        price: item.price,
        productId: item.productId,
        invoiceId: item.invoiceId,
        returnedInvoiceId: item.returnedInvoiceId,
        OrderNumber: item.OrderNumber,
        organizationId: organizationId,
      },
    });
  }

  // await prismaDb.payment.deleteMany();
  // const payments = JSON.parse(fs.readFileSync(`${dataDir}/payments.json`, "utf-8"));
  // for (const item of payments) {
  //   await prismaDb.payment.create({
  //     data: {
  //       id: item.id,
  //       number: item.number,
  //       date: new Date(item.date),
  //       amount: item.amount,
  //       customerId: item.customerId,
  //       method: item.method,
  //       notes: item.notes,
  //       invoiceId: item.invoiceId,
  //       createdAt: new Date(item.createdAt),
  //       updatedAt: new Date(item.updatedAt),
  //       organizationId: organizationId,
  //     },
  //   });
  // }

  console.log("Data import complete!");
}

importData().catch((e) => {
  console.error("Import error:", e);
  process.exit(1);
});
