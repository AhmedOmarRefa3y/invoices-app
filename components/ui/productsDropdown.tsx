// import React from "react";

// const productsDropdown = () => {
//     return (
//         <div>
//             <Popover open={IsPopoverOpen} onOpenChange={setPopoverOpen}>
//                 <div className="w-full">
//                     <label htmlFor="">الصنف</label>
//                     <PopoverTrigger asChild>
//                         <Button
//                             variant={"outline"}
//                             size="sm"
//                             role="combobox"
//                             aria-expanded={IsPopoverOpen}
//                             aria-label="اختر اسم الصنف"
//                             className={cn("w-full justify-between")}
//                         >
//                             {/* <PersonStanding className="mx-2 w-4" /> */}
//                             {product ? product.name : "اختر اسم الصنف"}
//                             <ChevronsUpDown className="ml-r h-4 w-4 shrink-0 opacity-50" />
//                         </Button>
//                     </PopoverTrigger>
//                 </div>
//                 <PopoverContent className="w-[250px] p-0">
//                     product
//                     <Command>
//                         <CommandList>
//                             <CommandInput placeholder="ابحث بالاسم..." />
//                             <CommandEmpty>
//                                 للا يوجد عميل بهذا الاسم
//                             </CommandEmpty>
//                             <CommandGroup>
//                                 {products.map((productInfo) => (
//                                     <CommandItem
//                                         key={productInfo.id}
//                                         onSelect={() =>
//                                             setprdouctID(productInfo.id)
//                                         }
//                                         className="text-sm"
//                                     >
//                                         {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
//                                         {productInfo.name}
//                                         <Check
//                                             className={cn(
//                                                 "mr-auto h-4 w-4 ",
//                                                 product?.id === prdouctID
//                                                     ? "opacity-100"
//                                                     : "opacity-0"
//                                             )}
//                                         ></Check>
//                                     </CommandItem>
//                                 ))}
//                             </CommandGroup>
//                         </CommandList>
//                         <CommandSeparator />
//                         <CommandList>
//                             <CommandGroup>
//                                 <CommandItem className="flex justify-center">
//                                     <AddNewCustomerModal />
//                                     <PlusCircle className="mr-2  h-5 w-5" />
//                                 </CommandItem>
//                             </CommandGroup>
//                         </CommandList>
//                     </Command>
//                 </PopoverContent>
//             </Popover>
//         </div>
//     );
// };

// export default productsDropdown;
