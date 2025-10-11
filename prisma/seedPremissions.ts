import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 🧩 قائمة كل الصلاحيات الأساسية في النظام
  const permissions = [
    // 🔹 إدارة الفواتير
    { name: "CREATE_INVOICE", description: "Can create sales invoices" },
    { name: "EDIT_INVOICE", description: "Can edit existing invoices" },
    { name: "DELETE_INVOICE", description: "Can delete invoices" },
    { name: "VIEW_INVOICE", description: "Can view all invoices" },

    // 🔹 إدارة المرتجعات
    { name: "CREATE_RETURNED_INVOICE", description: "Can create returned invoices" },
    { name: "VIEW_RETURNED_INVOICE", description: "Can view returned invoices" },

    // 🔹 إدارة العملاء والموردين
    { name: "CREATE_CUSTOMER", description: "Can add new customers" },
    { name: "EDIT_CUSTOMER", description: "Can edit customer details" },
    { name: "DELETE_CUSTOMER", description: "Can delete customers" },
    { name: "VIEW_CUSTOMER", description: "Can view customer information" },

    { name: "CREATE_SUPPLIER", description: "Can add new suppliers" },
    { name: "VIEW_SUPPLIER", description: "Can view suppliers" },

    // 🔹 إدارة المدفوعات
    { name: "CREATE_PAYMENT", description: "Can record payments" },
    { name: "VIEW_PAYMENT", description: "Can view payments" },
    { name: "CREATE_PAYMENT_TO_SUPPLIER", description: "Can record supplier payments" },
    { name: "VIEW_PAYMENT_TO_SUPPLIER", description: "Can view supplier payments" },

    // 🔹 إدارة المنتجات
    { name: "CREATE_PRODUCT", description: "Can create new products" },
    { name: "EDIT_PRODUCT", description: "Can edit products" },
    { name: "DELETE_PRODUCT", description: "Can delete products" },
    { name: "VIEW_PRODUCT", description: "Can view products" },

    // 🔹 إدارة الحسابات والقيود
    { name: "CREATE_JOURNAL_ENTRY", description: "Can create journal entries" },
    { name: "VIEW_JOURNAL_ENTRY", description: "Can view journal entries" },
    { name: "MANAGE_LEDGER_ACCOUNTS", description: "Can manage chart of accounts" },

    // 🔹 إدارة التقارير
    { name: "VIEW_REPORTS", description: "Can view financial reports" },

    // 🔹 إدارة النظام
    { name: "MANAGE_USERS", description: "Can manage users and roles" },
    { name: "MANAGE_ROLES", description: "Can manage roles and permissions" },
  ];

  console.log("🚀 Seeding permissions...");

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  console.log(`✅ ${permissions.length} permissions have been seeded successfully.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
