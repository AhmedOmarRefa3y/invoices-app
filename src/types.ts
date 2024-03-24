export type Organization = {
    id: string;
    name: string;
    ownerId: string;
    owner: User;
    managers: User[];
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
    Parts: Part[];
    LineItem: LineItem[];
    Orders: OrderItem[];
    invoices: Invoice[];
    Payment: Payment[];
    ReturnedInvoice: ReturnedInvoice[];
    ProductionPlan: ProductionPlan[];
    ProductionEvent: ProductionEvent[];
    Catgories: Category[];
    Units: Unit[];
    ProductionPLanProduct: ProductionPLanProduct[];
    Initialquantities: Initialquantities[];
    Customer: Customer[];
};

export type User = {
    id: string;
    userName: string;
    password: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;
};

export type Customer = {
    id: string;
    name: string;
    phoneNumber: string;
    location: string;
    CustomerCredit: number;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
};

export enum Roles {
    ADMIN = "ADMIN",
    USER = "USER",
}

export type Product = {
    id: string;
    code: number;
    name: string;
    price: number;
    catgoryId: string | null;
    unitId: string | null;
    createdAt: Date;
    updatedAt: Date;
    isAcomopsition: boolean;
    organizationId: string;
};

export type Part = {
    id: string;
    name: string;
    quantity: number;
    productId: string;
    product: Product | null;
    partProductId: string | null;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    organization: Organization;
};

export type OrderItem = {
    id: string;
    quantity: number;
    amount: number;
    productPackageId: string | null;
    invoiceId: string | null;
    returnedInvoiceId: string | null;
    OrderNumber: number;
    organizationId: string;
    organization: Organization;
};

export type LineItem = {
    id: string;
    amount: number | null;
    quantity: number;
    price: number | null;
    ItemNumber: number;
    productId: string;
    invoiceId: string | null;
    returnedInvoiceId: string | null;
    productionEventId: string | null;
    isProduction: boolean;
    isReduction: boolean;
    createdAt: Date;
    updatedAt: Date;
    productionPlanId: string | null;
    initialquantitiesId: string | null;
    organizationId: string;
    organization: Organization;
};

export type Initialquantities = {
    id: string;
    date: Date;
    year: number;

    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    organization: Organization;
};
export type Invoice = {
    id: string;
    number: number;
    date: Date;
    amount: number;

    customerId: string;
    customer: Customer;
    payment: Payment | null;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    organization: Organization;
};

export type ReturnedInvoice = {
    id: string;
    number: number;
    date: Date;
    amount: number;

    customerId: string;
    customer: Customer;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    organization: Organization;
};

export type ProductionPLanProduct = {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
    productionPlanId: string | null;
    ProductionPlan: ProductionPlan | null;
    organizationId: string;
    organization: Organization;
};

export type ProductionPlan = {
    id: string;
    number: number;
    producedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
    organization: Organization;
};

export type ProductionEvent = {
    id: string;
    number: number;
    producedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    productionPlanId: string | null;
    organizationId: string;
};

export type Payment = {
    id: string;
    number: number;
    date: Date;
    amount: number;
    customerId: string;

    method: string;
    notes: string;
    invoiceId: string | null;
    createdAt: Date;
    updatedAt: Date;
    organizationId: string;
};

export type Category = {
    id: string;
    name: string;
    organizationId: string;
};

export type Unit = {
    id: string;
    name: string;
    organizationId: string;
};

export interface NewProductDataT {
    name: string;
    price: number;
    categoryID: string;
    unitID: string;
    parts?: { productid: string; quantity: number; name: string }[] | undefined;
    isAcomopsition: boolean;
    PrdocutId?: string | undefined;
    orgID?: string;
}
