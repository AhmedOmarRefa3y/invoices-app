"use client";

import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "ar" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find((lang) => lang.code === pathname.split("/")[1]) || languages[0]
  );

  const switchLanguage = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    router.push(segments.join("/"));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 px-2 sm:px-3 border-dashed">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-flex">{currentLanguage.name}</span>
          <span className="inline-flex sm:hidden">{currentLanguage.flag}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "flex items-center gap-2 text-sm cursor-pointer",
              currentLanguage.code === language.code && "font-medium"
            )}
            onClick={() => {
              setCurrentLanguage(language);
              switchLanguage(language.code);
            }}
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage.code === language.code && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
