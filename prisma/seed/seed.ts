// prisma/seed/seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Seed customers with real names and emails
    const customerNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Eva Davis'];

    for (const name of customerNames) {
      await prisma.customer.create({
        data: {
          name,
          email: `email_${name.replace(' ', '_').toLowerCase()}@example.com`,
        },
      });
    }

    // Seed products with real names and prices
    const productNames = ['Product A', 'Product B', 'Product C', 'Product D'];
    const productPrices = [10, 20, 30, 40];

    for (let i = 0; i < productNames.length; i++) {
      await prisma.product.create({
        data: {
          name: productNames[i],
          price: productPrices[i],
        },
      });
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
