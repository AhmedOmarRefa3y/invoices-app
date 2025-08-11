"use client";

import { Check, ChevronsUpDown, Pencil, Trash2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useModals from "@/lib/zustand/useModals";
import { useTranslations } from "next-intl";

interface ComboboxT {
  data: { value: any; id: string }[];
  onSelect: (item: { value: any; id: string }) => void;
  selectedID: string | undefined;
  type?: "Unit" | "Category" | "Type";
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

export const Combobox: React.FC<ComboboxT> = ({ data, onSelect, selectedID, type, onEdit, onDelete }) => {
  const t = useTranslations("common");
  const Modals = useModals();
  const [open, setOpen] = React.useState(false);
  const [Id, setId] = React.useState<string | undefined>(selectedID);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between overflow-hidden px-3 py-2 text-sm font-medium border-stone-300 rounded-lg ${
            Id ? "text-gray-900" : "text-gray-500"
          } hover:bg-gray-50 transition-colors`}
        >
          <span className="truncate">
            {Id ? data.find((item) => item.id === selectedID)?.value : t("select")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0 rounded-lg border border-stone-300 m-0"
        side="bottom"
      >
        <Command className="rounded-lg border-0">
          <CommandGroup className="w-full p-0 rounded-lg">
            {data.map((item) => (
              <CommandItem
                key={item.value}
                className="flex justify-between w-full font-medium rounded-lg py-2 text-center text-sm hover:bg-gray-100 transition-colors"
                onSelect={() => {
                  setId(item.id === Id ? "" : item.id);
                  setOpen(false);
                  onSelect(item);
                }}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="whitespace-normal">{item.value}</span>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <Check
                    className={cn("h-4 w-4 text-blue-500", Id === item.id ? "opacity-100" : "opacity-0")}
                  />
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item.id, item.value);
                      }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id, item.value);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CommandItem>
            ))}
            {type === "Unit" && (
              <Button
                variant={"default"}
                className="w-full rounded-b-lg py-2 h-fit hover:bg-black/80 text-sm"
                onClick={() => {
                  Modals.setAddUnitModalIsOpen(true);
                }}
              >
                {t("add_unit")}
              </Button>
            )}
            {type === "Category" && (
              <Button
                className="w-full rounded-b-lg py-2 h-fit hover:bg-black/80 text-sm"
                onClick={() => {
                  Modals.setAddInventoryModalIsOpen(true);
                }}
              >
                {t("add_inventory")}
              </Button>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
