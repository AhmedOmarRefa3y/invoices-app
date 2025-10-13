"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import useModals from "@/lib/zustand/useModals";
import { format } from "date-fns";

const ViewPaymentModal = () => {
  const t = useTranslations("viewPaymentModal");
  const tCommon = useTranslations("common");
  const {
    ViewPaymentModalIsOpen,
    SetViewPaymentModalIsOpen,
    PaymentToBeEdited,
    SetAddPaymentModalIsOpen,
  } = useModals();

  const closeModal = () => {
    SetViewPaymentModalIsOpen(false);
  };

  const handleEdit = () => {
    // Close this modal and open the AddNewPaymentModal in edit mode
    closeModal();
    SetAddPaymentModalIsOpen(true);
  };

  // If no payment is selected, don't render anything
  if (!PaymentToBeEdited) {
    return null;
  }

  return (
    <Dialog open={ViewPaymentModalIsOpen} onOpenChange={closeModal}>
      <DialogContent className="md:w-fit w-[98%] transition-all shadow-2xl border border-stone-300 bg-white p-2 z-[100]">
        <DialogHeader className="flex items-center mt-2">
          <DialogTitle>{t("payment_details")}</DialogTitle>
        </DialogHeader>
        <div className="py-4 rounded-lg">
          <div className="grid grid-cols-1 md:w-[400px] gap-4 items-end">
            <div className="w-full">
              <label className="font-bold text-base">{tCommon("date")}</label>
              <div className="w-full flex justify-between text-left font-bold border border-stone-300 p-2 rounded">
                {PaymentToBeEdited.date ? format(new Date(PaymentToBeEdited.date), "PPP") : "-"}
              </div>
            </div>

            <div className="basis-[190px]">
              <label className="font-bold text-base">{t("method")}</label>
              <div className="w-full flex justify-between text-left font-bold border border-stone-300 p-2 rounded">
                {PaymentToBeEdited.method || "-"}
              </div>
            </div>

            <div className="basis-[190px]">
              <label className="font-bold text-base">{t("amount")}</label>
              <div className="w-full flex justify-between text-left font-bold border border-stone-300 p-2 rounded">
                {PaymentToBeEdited.amount || "-"}
              </div>
            </div>

            {PaymentToBeEdited.number && (
              <div className="basis-[190px]">
                <label className="font-bold text-base">{t("payment_number")}</label>
                <div className="w-full flex justify-between text-left font-bold border border-stone-300 p-2 rounded">
                  {PaymentToBeEdited.number}
                </div>
              </div>
            )}

            {PaymentToBeEdited.Note && (
              <div className="basis-[190px]">
                <label className="font-bold text-base">{t("notes")}</label>
                <div className="w-full flex justify-between text-left font-bold border border-stone-300 p-2 rounded">
                  {PaymentToBeEdited.Note}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleEdit} className="basis-[190px]">
                {tCommon("edit")}
              </Button>
              <Button onClick={closeModal} className="basis-[190px]" variant="outline">
                {tCommon("close")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentModal;
