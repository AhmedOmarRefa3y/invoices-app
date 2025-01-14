"use client";
import { Button } from "@/components/ui/button";
import useInitaliQuanttiesStore from "@/lib/zustand/initialStore";
import { useRouter } from "@/i18n/routing";

import React from "react";

const EditListBtn = ({
  items,
  id,
}: {
  items: {
    id: string;
    name: string;
    Quantity: number;
    unit: string;
  }[];
  id: string;
}) => {
  // console.log(items);

  const router = useRouter();
  const init = useInitaliQuanttiesStore();

  return (
    <Button
      onClick={() => {
        init.clearAll();
        items.map((item) => {
          init.AddProduct(item);
        });
        init.setEditID(id);
        init.setEditMode(true);
        router.push("/inventory/initial-quantities/new");
      }}
    >
      Edit
    </Button>
  );
};

export default EditListBtn;
