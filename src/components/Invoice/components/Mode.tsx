"use client";

import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

const Mode = () => {
  const PathName = usePathname();
  const params: { orgid: string } = useParams();
  const [Mode, setMode] = useState(PathName === `/${params.orgid}/add-returns-invoice` ? 2 : 1);
  const router = useRouter();
  const Modes = [
    { id: 1, name: "Sales" },
    { id: 2, name: "Returns" },
  ];

  return (
    <div className="flex items-center flex-col justify-between font-extrabold text-black">
      <label htmlFor="">Invoice Type</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            size="sm"
            role="combobox"
            className={cn(
              `w-[120px]  justify-center gap-1 h-9 font-extrabold text-black text-lg border-stone-300 rounded-none`
            )}
          >
            {Mode ? Modes.find((ModeItem) => ModeItem.id === Mode)?.name : "Invoice Type"}
            <ChevronsUpDown className="  w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[160px]">
          <Command>
            <CommandList>
              <CommandGroup>
                {Modes.map((ModeItem) => (
                  <div key={ModeItem.id} className=" flex justify-between text-lg font-extrabold">
                    <CommandItem
                      key={ModeItem.id}
                      onSelect={() => {
                        setMode(ModeItem.id);
                        router.push(
                          `/${params.orgid}/${
                            ModeItem.id === 1 ? "add-sales-invoice" : "add-returns-invoice"
                          }`
                        );
                      }}
                      className={cn("text-sm w-full", ModeItem.id === Mode ? "bg-green-400" : "")}
                    >
                      <span className="text-lg">{ModeItem.name}</span>
                      <Check
                        className={cn(
                          "mr-auto w-4",
                          ModeItem.id === Mode ? "opacity-100" : "opacity-0"
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
  );
};

export default Mode;
