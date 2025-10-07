"use server";

import { getNextInvoiceNumber, getNextPaymentNumber, revalidateApp } from "@/actions";
import prismaDb from "@/lib/prisma";
import { PartT } from "@/lib/types";
import { revalidatePath } from "next/cache";
export interface saveInvoiceType {
  customerId: string;
  date: Date;
  InvoiceItems: {
    id: string;
    quantity: number;
    price: number;
  }[];
  invoiceAmount: number;
  paidAmount: number;
  orgid: string;
}

interface UpdateInvoiceType {
  Id: string;
  customerId: string;
  date: Date;
  InvoiceItems: {
    id: string;
    quantity: number;
    price: number;
    parts?: Pick<PartT, "productId" | "quantity" | "name">[];
  }[];
  invoiceAmount: number;
  paidAmount: number;
  orgid: string;
}

export const SaveSalesInvoiceAction = async (InvoiceData: saveInvoiceType) => {
  try {
    const { InvoiceItems, customerId, date, invoiceAmount, paidAmount, orgid } = InvoiceData;
    if (!orgid) {
      throw new Error("orgid is required");
    }
    if (!customerId) {
      throw new Error("Customer Id is required");
    }
    if (!date) {
      throw new Error("date  is required");
    }
    if (!InvoiceItems || InvoiceItems.length < 1) {
      throw new Error("invoice items are empty");
    }
    if (!invoiceAmount || typeof invoiceAmount !== "number") {
      throw new Error("invoiceAmount is required");
    }
    // get all products in the invoice to create line Items later
    const items = await Promise.all(
      InvoiceItems.map(async (item) => {
        const Prod = await prismaDb.product.findUnique({
          where: {
            id: item.id,
            organizationId: orgid,
          },
          include: {
            Part: true,
          },
        });
        if (Prod) {
          return {
            id: Prod.id,
            parts: Prod.Part,
            quantity: item.quantity,
          };
        }
      })
    );

    const Lineitems: { id: string; quantity: number }[] = [];
    items.forEach((item) => {
      if (item) {
        if (item.parts.length < 1) {
          const isItemAlreadyThere = Lineitems.find((lineItem) => lineItem.id == item.id);

          if (isItemAlreadyThere) {
            Lineitems.forEach((lineItem) => {
              if (lineItem.id == item.id) {
                lineItem.quantity += item.quantity;
              }
            });
          } else {
            Lineitems.push({
              id: item.id,
              quantity: item.quantity,
            });
          }
        } else {
          item.parts.forEach((part) => {
            const isItemAlreadyThere = Lineitems.find(
              (lineItem) => lineItem.id == part.partProductId
            );
            if (isItemAlreadyThere) {
              Lineitems.forEach((lineItem) => {
                if (lineItem.id == part.partProductId) {
                  lineItem.quantity += part.quantity * item.quantity;
                }
              });
            } else {
              if (part.partProductId) {
                Lineitems.push({
                  id: part.partProductId,
                  quantity: part.quantity * item.quantity,
                });
              }
            }
          });
        }
      }
    });
    const invoiceNumber = await getNextInvoiceNumber(orgid);
    const paymentNumber = await getNextPaymentNumber(orgid);

    const Invoice = await prismaDb.$transaction(async (tx) => {
      // Step 2: Create the invoice using the new number
      return tx.invoice.create({
        data: {
          number: invoiceNumber,
          customerId: customerId,
          date: date,
          orders: {
            createMany: {
              data: InvoiceItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                amount: item.price * item.quantity,
                organizationId: orgid,
              })),
            },
          },
          lineItems: {
            createMany: {
              data: Lineitems.map((item, i) => ({
                ItemNumber: i + 1,
                productId: item.id,
                quantity: item.quantity,
                organizationId: orgid,
              })),
            },
          },
          amount: invoiceAmount,
          payment:
            paidAmount && paidAmount > 0.1
              ? {
                  create: {
                    number: paymentNumber,
                    amount: paidAmount,
                    customer: { connect: { id: customerId } },
                    method: "Cash",
                    date: date,
                    organization: { connect: { id: orgid } },
                  },
                }
              : undefined,
          organizationId: orgid,
        },
        select: {
          orders: true,
          lineItems: true,
          number: true,
        },
      });
    });

    // console.log(Invoice);

    revalidatePath("/", "layout");

    return {
      status: "ok",
      message: "invoice saved succesfully",
      data: Invoice,
    };
  } catch (error) {
    // console.log(error);

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "something went wrong while saving invoice ",
      data: null,
    };
  }
};

export const UpdateSalesInvoiceAction = async (InvoiceData: UpdateInvoiceType) => {
  try {
    const { InvoiceItems, customerId, date, invoiceAmount, paidAmount, Id, orgid } = InvoiceData;
    // errors
    if (!orgid) {
      throw new Error("orgid is required");
    }
    if (!Id) {
      throw new Error("invoice Id is required");
    }
    if (!customerId) {
      throw new Error("Customer Id is required");
    }
    if (!date) {
      throw new Error("date  is required");
    }
    if (!InvoiceItems || InvoiceItems.length < 1) {
      throw new Error("invoice items are empty");
    }
    if (!invoiceAmount) {
      throw new Error("invoiceAmount is required");
    }
    // get existing Invoice from db
    const existingInvoice = await prismaDb.invoice.findUnique({
      where: {
        id: Id,
      },
      include: {
        customer: true,
        orders: true,
        lineItems: true,
        payment: true,
      },
    });

    if (!existingInvoice) {
      throw new Error("there is no invoice with the provided Id");
    }
    // update inventory (decrement)

    // delete invoice lineItems
    existingInvoice?.lineItems.forEach(async (item) => {
      await prismaDb.lineItem.delete({
        where: {
          id: item.id,
        },
      });
    });
    // delete invoice orders
    existingInvoice?.orders.forEach(async (item) => {
      await prismaDb.orderItem.delete({
        where: {
          id: item.id,
        },
      });
    });
    // delete invoice  payemnt
    if (existingInvoice.payment) {
      await prismaDb.payment.delete({
        where: {
          invoiceId: existingInvoice?.id,
        },
      });
      // console.log(deletedPayment);
    }

    // get all products in the invoice to create line Items later
    const items = await Promise.all(
      InvoiceItems.map(async (item) => {
        const Prod = await prismaDb.product.findUnique({
          where: {
            id: item.id,
            organizationId: orgid,
          },
          include: {
            Part: true,
          },
        });
        if (Prod) {
          return {
            id: Prod.id,
            parts: Prod.Part,
            quantity: item.quantity,
          };
        }
      })
    );
    // console.log(items);

    const Lineitems: { id: string; quantity: number }[] = [];
    items.forEach((item) => {
      if (item) {
        if (item.parts.length < 1) {
          const isItemAlreadyThere = Lineitems.find((lineItem) => lineItem.id == item.id);

          if (isItemAlreadyThere) {
            Lineitems.forEach((lineItem) => {
              if (lineItem.id == item.id) {
                lineItem.quantity += item.quantity;
              }
            });
          } else {
            Lineitems.push({
              id: item.id,
              quantity: item.quantity,
            });
          }
        } else {
          item.parts.forEach((part) => {
            const isItemAlreadyThere = Lineitems.find(
              (lineItem) => lineItem.id == part.partProductId
            );
            if (isItemAlreadyThere) {
              Lineitems.forEach((lineItem) => {
                if (lineItem.id == part.partProductId) {
                  lineItem.quantity += part.quantity * item.quantity;
                }
              });
            } else {
              if (part.partProductId) {
                Lineitems.push({
                  id: part.partProductId,
                  quantity: part.quantity * item.quantity,
                });
              }
            }
          });
        }
      }
    });
    const paymentNumber = await getNextPaymentNumber(orgid);

    const Invoice = await prismaDb.invoice.update({
      where: {
        id: Id,
      },
      data: {
        customerId: customerId,
        date: date,
        orders: {
          createMany: {
            data: InvoiceItems.map((item, i) => {
              return {
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                amount: item.price * item.quantity,
                OrderNumber: i + 1,
                organizationId: orgid,
              };
            }),
          },
        },
        lineItems: {
          createMany: {
            data: Lineitems.map((item, i) => {
              return {
                ItemNumber: i + 1,
                productId: item.id,
                quantity: item.quantity,
                organizationId: orgid,
              };
            }),
          },
        },
        amount: invoiceAmount,
        payment:
          paidAmount && paidAmount > 0.1
            ? {
                create: {
                  number: paymentNumber,
                  amount: paidAmount,
                  customer: {
                    connect: {
                      id: customerId,
                    },
                  },
                  method: "Cash",
                  date: date,
                  organization: {
                    connect: {
                      id: orgid,
                    },
                  },
                },
              }
            : undefined,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "invoice updated succesfully",
      data: Invoice,
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: error instanceof Error ? error.name : "something went while updating invoice ",
      data: null,
    };
  }
};

export const DeleteSalesInvoiceAction = async (Id: string) => {
  try {
    const existingInvoice = await prismaDb.invoice.findUnique({
      where: {
        id: Id,
      },
      include: {
        customer: true,
        lineItems: true,
      },
    });

    if (!existingInvoice) {
      throw new Error("there is no invoice with the provided Id");
    }
    // update inventory

    // Delete Invoice
    await prismaDb.invoice.delete({
      where: {
        id: Id,
      },
    });

    revalidateApp();
    return {
      status: "ok",
      message: "invoice deleted succesfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "something went while deleting invoice ",
      data: null,
    };
  }
};

export const GetAvaiableSalesInvoices = async (orgID: string) => {
  const Invoices = await prismaDb.invoice.findMany({
    where: {
      organizationId: orgID,
    },
    select: {
      number: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return Invoices;
};

export const GetAvaiableReturnsInvoices = async (orgID: string) => {
  const Invoices = await prismaDb.returnedInvoice.findMany({
    where: {
      organizationId: orgID,
    },
    select: {
      number: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  return Invoices;
};
