"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreateCustomer, UpdateCustomer } from "@/actions/customer";

import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Formbtn from "../ui/Form-btn";

import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";

export function AddNewCustomerModalNEW() {
  const t = useTranslations("addNewCustomerModal");
  const params: { orgid: string } = useParams();
  const ModalsStore = useModals();
  const {
    customerToBeEdited,
    AddcustomerModalIsOpen,
    SetAddcustomerModalIsOpen,
    ClearCustomerToBeEdited,
  } = ModalsStore;

  const [formData, setFormData] = useState<{
    customerName: string;
    location: string;
    phoneNumber: string;
    OpenCredit: number;
  }>({
    customerName: "",
    location: "",
    phoneNumber: "",
    OpenCredit: 0,
  });

  const CreditTypes = [
    { id: "1", name: t("debitor") },
    { id: "2", name: t("creditor") },
  ];
  const [CreditTypeID, setCreditTypeID] = useState<undefined | string>("2");

  const onSubmit = async () => {
    const OpenCredit = CreditTypeID === "2" ? formData.OpenCredit * -1 : formData.OpenCredit;
    if (formData.customerName.length < 5) {
      toast.error(t("name_required_5Letters"));
      return;
    }
    if (!customerToBeEdited) {
      const res = await CreateCustomer({
        ...formData,
        OpenCredit,
        orgid: params.orgid,
      });
      if (res.status === "ok") {
        SetAddcustomerModalIsOpen(false);
        setFormData({
          customerName: "",
          location: "",
          phoneNumber: "",
          OpenCredit: 0,
        });
        toast.success(t("customerCreated"));
      } else {
        toast.error(res.message);
      }
    }
    if (customerToBeEdited) {
      const res = await UpdateCustomer({
        id: customerToBeEdited?.customerId,
        ...formData,
        OpenCredit,
      });
      if (res.status === "ok") {
        SetAddcustomerModalIsOpen(false);
        setFormData({
          customerName: "",
          location: "",
          phoneNumber: "",
          OpenCredit: 0,
        });
        toast.success(t("customerUpdated"));
      } else {
        toast.error(res.message);
      }
    }
  };

  useEffect(() => {
    if (customerToBeEdited) {
      setFormData({
        customerName: customerToBeEdited.customerName,
        location: customerToBeEdited.address,
        phoneNumber: customerToBeEdited.PhoneNumber,
        OpenCredit:
          customerToBeEdited.OpenCredit > 1
            ? customerToBeEdited.OpenCredit
            : customerToBeEdited.OpenCredit * -1,
      });

      setCreditTypeID(
        customerToBeEdited.OpenCredit > 0
          ? "1"
          : customerToBeEdited.OpenCredit < 0
          ? "2"
          : undefined
      );
    }
  }, [customerToBeEdited]);

  const closeMOdal = () => {
    SetAddcustomerModalIsOpen(!AddcustomerModalIsOpen);
    setFormData({
      customerName: "",
      location: "",
      phoneNumber: "",
      OpenCredit: 0,
    });
    ClearCustomerToBeEdited();
  };

  return (
    <Dialog open={AddcustomerModalIsOpen} onOpenChange={closeMOdal}>
      <DialogContent className="sm:max-w-md border-stone-300 shadow-lg border font-bold w-[98%] z-[100]">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>{customerToBeEdited ? t("edit_customer") : t("add_customer")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex items-end justify-center gap-2 w-full flex-wrap font-bold"
        >
          <div className="w-full">
            <label className="whitespace-nowrap">{t("name")}</label>
            <Input
              className="font-bold border-stone-300"
              placeholder={t("name")}
              value={formData.customerName}
              onChange={(e) => {
                setFormData((perv) => ({
                  ...perv,
                  customerName: e.target.value,
                }));
              }}
            />
          </div>
          <div className="w-full">
            <label className="whitespace-nowrap">{t("address")}</label>
            <Input
              placeholder={t("address")}
              value={formData.location}
              className="font-bold border-stone-300"
              onChange={(e) => {
                setFormData((perv) => ({
                  ...perv,
                  location: e.target.value,
                }));
              }}
            />
          </div>
          <div className="w-full overflow-hidden">
            <label className="whitespace-nowrap">{t("OpenBalance")}</label>
            <Input
              type="number"
              placeholder={t("OpenBalance")}
              value={formData.OpenCredit}
              min={0}
              className="text-center font-bold border-stone-300 overflow-hidden"
              onChange={(e) => {
                setFormData((perv) => ({
                  ...perv,
                  OpenCredit: e.target.valueAsNumber,
                }));
              }}
            />
          </div>
          <div className="overflow-hidden w-full">
            <label className="whitespace-nowrap">{t("BalanceType")}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  size="sm"
                  role="combobox"
                  className={cn(
                    `gap-1 w-full h-10 flex justify-between font-bold border-stone-300 overflow-hidden`
                  )}
                >
                  {CreditTypeID
                    ? CreditTypes.find((Type) => Type.id === CreditTypeID)?.name
                    : t("BalanceType")}
                  <ChevronsUpDown className="w-4 shrink-0 font-bold" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full p-1 border-stone-300 border"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {CreditTypes.map((Type) => (
                        <div key={Type.id} className="flex justify-between items-center w-full">
                          <CommandItem
                            key={Type.id}
                            onSelect={() => {
                              setCreditTypeID(Type.id === CreditTypeID ? undefined : Type.id);
                            }}
                            className="text-sm w-full flex border border-b-stone-300"
                          >
                            <span className="w-full text-lg">{Type.name}</span>
                            <Check
                              className={cn(
                                "mr-auto w-4",
                                Type.id === CreditTypeID ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        </div>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full">
            <label className="whitespace-nowrap">{t("phone")}</label>
            <Input
              pattern="^01[0-2]\d{1,2}$"
              placeholder={t("phone")}
              value={formData.phoneNumber}
              type="number"
              min={1}
              className="font-bold border-stone-300"
              onChange={(e) => {
                setFormData((perv) => ({
                  ...perv,
                  phoneNumber: e.target.value,
                }));
              }}
            />
          </div>
          <Formbtn />
        </form>
      </DialogContent>
    </Dialog>
  );
}
