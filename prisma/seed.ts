import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const orgId = "e28656ed-701f-4ca1-b41e-8417b439ddfb";

  // Get main accounts (already created)
  const mainAccounts = await prisma.ledgerAccount.findMany({
    where: { organizationId: orgId, parentId: null },
  });

  // Helper function to find parent by name
  const getParent = (name: string) =>
    mainAccounts.find((a) => a.name.toLowerCase() === name.toLowerCase());

  // Define subaccounts for each root
  const subAccounts = [
    // 🟢 Assets
    {
      parent: "Assets",
      accounts: [
        { code: "1100", name: "Current Assets", isLeaf: false },
        { code: "1200", name: "Fixed Assets", isLeaf: false },
      ],
    },
    {
      parent: "Current Assets",
      accounts: [
        { code: "1110", name: "Cash", isLeaf: true },
        { code: "1120", name: "Bank", isLeaf: true },
        { code: "1130", name: "Accounts Receivable", isLeaf: true },
        { code: "1140", name: "Inventory", isLeaf: true },
      ],
    },
    {
      parent: "Fixed Assets",
      accounts: [
        { code: "1210", name: "Equipment", isLeaf: true },
        { code: "1220", name: "Furniture", isLeaf: true },
        { code: "1230", name: "Vehicles", isLeaf: true },
      ],
    },

    // 🔴 Liabilities
    {
      parent: "Liabilities",
      accounts: [{ code: "2100", name: "Current Liabilities", isLeaf: false }],
    },
    {
      parent: "Current Liabilities",
      accounts: [
        { code: "2110", name: "Accounts Payable", isLeaf: true },
        { code: "2120", name: "Accrued Expenses", isLeaf: true },
      ],
    },

    // 🟡 Equity
    {
      parent: "Equity",
      accounts: [
        { code: "3100", name: "Owner’s Capital", isLeaf: true },
        { code: "3200", name: "Retained Earnings", isLeaf: true },
      ],
    },

    // 🔵 Income
    {
      parent: "Income",
      accounts: [
        { code: "4100", name: "Sales Revenue", isLeaf: true },
        { code: "4200", name: "Service Revenue", isLeaf: true },
      ],
    },

    // 🟠 Expenses
    {
      parent: "Expenses",
      accounts: [
        { code: "5100", name: "Cost of Goods Sold", isLeaf: true },
        { code: "5200", name: "Rent Expense", isLeaf: true },
        { code: "5300", name: "Salaries Expense", isLeaf: true },
        { code: "5400", name: "Utilities Expense", isLeaf: true },
      ],
    },
  ];

  // Helper: create account if not exists
  async function ensureAccount(
    name: string,
    code: string,
    parentId: string | null,
    type: string,
    normalSide: string,
    isLeaf: boolean
  ) {
    const exists = await prisma.ledgerAccount.findFirst({
      where: { code, organizationId: orgId },
    });

    if (!exists) {
      await prisma.ledgerAccount.create({
        data: {
          code,
          name,
          parentId,
          type: type as any,
          normalSide: normalSide as any,
          organizationId: orgId,
          isLeaf,
        },
      });
      console.log(`✅ Created account: ${name}`);
    } else {
      console.log(`⚠️ Account already exists: ${name}`);
    }
  }

  // Loop through all subaccounts and create them
  for (const group of subAccounts) {
    // Try to find parent by name in DB
    let parent = await prisma.ledgerAccount.findFirst({
      where: {
        name: group.parent,
        organizationId: orgId,
      },
    });

    // If not found in DB yet, check if it's part of previous sub-accounts created
    if (!parent) {
      parent = await prisma.ledgerAccount.findFirst({
        where: { name: group.parent, organizationId: orgId },
      });
    }

    if (!parent) {
      console.warn(`⚠️ Parent not found: ${group.parent}`);
      continue;
    }

    for (const acc of group.accounts) {
      await ensureAccount(
        acc.name,
        acc.code,
        parent.id,
        parent.type,
        parent.normalSide,
        acc.isLeaf
      );
    }
  }

  console.log("🎯 Sub-accounts seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
