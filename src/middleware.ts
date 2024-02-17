export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/",
        "/invoices/:path*",
        "/accounts-reports/:path*",
        "/addinvoice/:path*",
        "/inventory/:path*",
        "/returnedInvoices/:path*",
        "/Payments/:path*",
        "/production/:path*",
    ],
};
