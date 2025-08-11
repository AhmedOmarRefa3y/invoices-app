"use client";

import useModals from "@/lib/zustand/useModals";
import { useEffect } from "react";

const OpenModal = () => {
  const onOpen = useModals((state) => state.setAddOrgModalIsOpen);

  useEffect(() => {
    console.log("OpenModal: Setting addOrgMOdalIsOpen to true");
    onOpen(true);
  }, [onOpen]);

  console.log("OpenModal: Component rendered");
  return null;
};

export default OpenModal;
