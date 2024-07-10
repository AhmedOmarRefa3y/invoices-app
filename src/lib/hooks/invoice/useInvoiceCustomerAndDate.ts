import usePurchaseInvoice from "@/lib/zustand/PurchaseStore";
import useReturnsInvoice from "@/lib/zustand/ReturnsInvoice";
import useInvoice from "@/lib/zustand/invoiceStore";
import useModals from "@/lib/zustand/useModals";
import { Customer } from "@prisma/client";

const useCusomterAndDate = (
    type: "sales" | "returns" | "purchases",
    customers: Customer[]
) => {
    const ModalsStore = useModals();
    const SalesStore = useInvoice();
    const ReturnsStore = useReturnsInvoice();
    const PurchasesStore = usePurchaseInvoice();
    const { SetAddcustomerModalIsOpen, setcustomerToBeEdited } = ModalsStore;

    const customerID: string | null =
        type === "sales"
            ? SalesStore.customerId
            : type === "returns"
            ? ReturnsStore.customerId
            : type === "purchases"
            ? PurchasesStore.SupplierId
            : null;
    const setCustomer = (customerId: string | null) => {
        switch (type) {
            case "sales":
                return SalesStore.setCustomerId(customerId);
            case "returns":
                return ReturnsStore.setCustomerId(customerId);
            case "purchases":
                return PurchasesStore.setSupplierId(customerId);
        }
    };

    const customerIfno = customers.find((item) => item.id === customerID);
    return {
        customerID,
        customerIfno,
        setCustomer,
        setcustomerToBeEdited,
        SetAddcustomerModalIsOpen,
    };
};

export default useCusomterAndDate;
