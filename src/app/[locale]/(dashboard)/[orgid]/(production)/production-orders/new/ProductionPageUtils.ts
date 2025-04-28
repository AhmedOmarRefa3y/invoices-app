"use client";

import { CreateProduction } from "@/actions/production";
import useProdcutionStore, { ProductionProduct } from "@/lib/zustand/productionStore";
import toast from "react-hot-toast";

interface productionItem {
  id: string;
  quantity: number;
  type: "in" | "out";
}

interface SaveProductionT {
  MainProducts: ProductionProduct[];
  RawMaterials: ProductionProduct[];
  productionPlanID: string;
  orgid: string;
}
export const SaveProduction = async ({
  MainProducts,
  RawMaterials,
  productionPlanID,
  orgid,
}: SaveProductionT) => {
  console.log(MainProducts, RawMaterials, productionPlanID, orgid);

  if (MainProducts.length === 0) {
    toast.error("You must enter products");
  }
  const Items: productionItem[] = [];

  MainProducts.map((item) => {
    if (item.Quantity > 0) {
      Items.push({
        id: item.id,
        quantity: item.Quantity,
        type: "in",
      });
    }
  });
  RawMaterials.map((item) => {
    if (item.Quantity > 0) {
      Items.push({
        id: item.id,
        quantity: item.Quantity,
        type: "out",
      });
    }
  });

  const sendTODb = async () => {
    const { status, data, message } = await CreateProduction({
      productionItems: Items,
      productionPlanI: productionPlanID,
      orgid,
    });
    if (status === "ok") {
      toast.success(message);
    } else {
      toast.error(message);
    }
    return {
      status,
      data,
      message,
    };
  };
  return sendTODb();
};
