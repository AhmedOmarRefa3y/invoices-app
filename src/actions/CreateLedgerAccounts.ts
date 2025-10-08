import { BalanceSide, LedgerAccountType, PrismaClient } from "@prisma/client";

export async function createMainLedgerAccountsForOrg(orgId: string, tx: PrismaClient | any) {
  console.log(`🚀 Creating ledger accounts for org: ${orgId}`);

  // 1️⃣ Define main accounts
  const mainAccounts = [
    {
      code: "1000",
      name: "Assets",
      type: LedgerAccountType.ASSET,
      normalSide: BalanceSide.DEBIT,
      isLeaf: false,
    },
    {
      code: "2000",
      name: "Liabilities",
      type: LedgerAccountType.LIABILITY,
      normalSide: BalanceSide.CREDIT,
      isLeaf: false,
    },
    {
      code: "3000",
      name: "Equity",
      type: LedgerAccountType.EQUITY,
      normalSide: BalanceSide.CREDIT,
      isLeaf: false,
    },
    {
      code: "4000",
      name: "Income",
      type: LedgerAccountType.INCOME,
      normalSide: BalanceSide.CREDIT,
      isLeaf: false,
    },
    {
      code: "5000",
      name: "Expenses",
      type: LedgerAccountType.EXPENSE,
      normalSide: BalanceSide.DEBIT,
      isLeaf: false,
    },
  ];

  // 2️⃣ Ensure main accounts exist
  for (const acc of mainAccounts) {
    const existing = await tx.ledgerAccount.findFirst({
      where: { code: acc.code, organizationId: orgId },
    });
    if (!existing) {
      await tx.ledgerAccount.create({
        data: { ...acc, organizationId: orgId },
      });
      console.log(`✅ Created main account: ${acc.name}`);
    }
  }

  // 3️⃣ Fetch main accounts
  const mainAccountsInDb = await tx.ledgerAccount.findMany({
    where: { organizationId: orgId, parentId: null },
  });

  const subAccounts = [
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
    {
      parent: "Equity",
      accounts: [
        { code: "3100", name: "Owner’s Capital", isLeaf: true },
        { code: "3200", name: "Retained Earnings", isLeaf: true },
      ],
    },
    {
      parent: "Income",
      accounts: [
        { code: "4100", name: "Sales Revenue", isLeaf: true },
        { code: "4200", name: "Service Revenue", isLeaf: true },
      ],
    },
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

  // Helper
  async function ensureAccount(
    name: string,
    code: string,
    parentId: string | null,
    type: LedgerAccountType,
    normalSide: BalanceSide,
    isLeaf: boolean
  ) {
    const exists = await tx.ledgerAccount.findFirst({ where: { code, organizationId: orgId } });
    if (!exists) {
      await tx.ledgerAccount.create({
        data: { code, name, parentId, type, normalSide, organizationId: orgId, isLeaf },
      });
      console.log(`✅ Created sub-account: ${name}`);
    }
  }

  for (const group of subAccounts) {
    const parent = await tx.ledgerAccount.findFirst({
      where: { name: group.parent, organizationId: orgId },
    });

    if (!parent) continue;

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

  console.log("🎯 Ledger accounts created successfully!");
}
