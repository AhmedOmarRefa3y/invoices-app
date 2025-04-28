"use client";
import useModals from "@/lib/zustand/useModals";
import { useEffect } from "react";
import LoadingComp from "@/components/loadingComp";

const OpenModal = () => {
  const isOpen = useModals((state) => state.addOrgMOdalIsOpen);
  const onOpen = useModals((state) => state.setAddOrgModalIsOpen);
  useEffect(() => {
    if (!isOpen) {
      onOpen(true);
    }
  }, [isOpen, onOpen]);
  return <LoadingComp />;
};

export default OpenModal;
