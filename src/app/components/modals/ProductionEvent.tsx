// "use client";

// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from "@/components/ui/command";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";

// import { cn } from "@/lib/utils";
// import { Check, ChevronsUpDown, Edit } from "lucide-react";

// import { useState } from "react";
// import { Popover, PopoverContent } from "../ui/popover";
// import { Product } from "@prisma/client";
// import { Input } from "../ui/input";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import useInvoice from "@/lib/zustand";
// import { CreateProduction } from "@/actions/production";

// interface ProductionEventProps {
//     products: Product[];
// }

// export const ProductionEvent: React.FC<ProductionEventProps> = ({
//     products,
// }) => {
//     const [prdouctID, setprdouctID] = useState<string | null>();
//     const [quantity, setQuantity] = useState(0);
//     const [IsPopoverOpen, setPopoverOpen] = useState(false);
//     const invoice = useInvoice();
//     const { IsProductioModalOpen, SetIsProductioModalOpen } = invoice;

//     const router = useRouter();
//     const product = products.find((item) => item.id === prdouctID);

//     const ProductionEvent = async () => {
//         const res = await CreateProduction({
//             prdouctID: prdouctID || "",
//             quantity,
//         });

//         if (res.status === "ok") {
//             SetIsProductioModalOpen(false);
//             toast.success("تم الاضافة بنجاح");
//         } else {
//             toast.error(res.message);
//         }
//     };

//     return (
//         <div className="flex items-center z-[200]  justify-center ">
//             <Dialog
//                 open={IsProductioModalOpen}
//                 onOpenChange={SetIsProductioModalOpen}
//             >
//                 <DialogContent className="max-w-screen-md p-0 border-2 border-black bg-red-500 bg-opacity-0">
//                     <div className="overflow-x-auto relative bg-white  flex flex-col rounded-lg z-50 justify-center items-center w-full h-full ">
//                         <div className="flex items-center justify-center gap-10 p-10 ">
//                             <Popover
//                                 open={IsPopoverOpen}
//                                 onOpenChange={setPopoverOpen}
//                             >
//                                 <div className="overflow-hidden w-[300px]">
//                                     <label
//                                         htmlFor=""
//                                         className={`flex flex-row `}
//                                     >
//                                         الصنف
//                                     </label>
//                                     <PopoverTrigger asChild>
//                                         <Button
//                                             variant={"outline"}
//                                             size="sm"
//                                             role="combobox"
//                                             aria-expanded={IsPopoverOpen}
//                                             aria-label="اختر اسم الصنف"
//                                             className={cn(
//                                                 `w-full justify-between h-[40px] `
//                                             )}
//                                         >
//                                             {product
//                                                 ? product.name
//                                                 : "اختر اسم الصنف"}
//                                             <ChevronsUpDown className="ml-r  w-4 shrink-0 opacity-50" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     {/* {productEroor ? <span>{productEroor}</span> : null} */}
//                                 </div>
//                                 <PopoverContent className="w-[310px] p-0">
//                                     <Command>
//                                         <CommandList>
//                                             <CommandInput placeholder="ابحث بالاسم..." />
//                                             <CommandEmpty>
//                                                 للا يوجد صنف بهذا الاسم
//                                             </CommandEmpty>
//                                             <CommandGroup>
//                                                 {products.map((productInfo) => (
//                                                     <div
//                                                         className=" flex justify-between items-center "
//                                                         key={productInfo.id}
//                                                     >
//                                                         <CommandItem
//                                                             key={productInfo.id}
//                                                             onSelect={() => {
//                                                                 // console.log(
//                                                                 //     productInfo.name
//                                                                 // );
//                                                                 setprdouctID(
//                                                                     productInfo.id
//                                                                 );
//                                                             }}
//                                                             className="text-sm w-full   "
//                                                         >
//                                                             {/* <PersonStanding className="mr-2 h-4 w-4" /> */}
//                                                             <span className="w-full">
//                                                                 {
//                                                                     productInfo.name
//                                                                 }
//                                                             </span>
//                                                             <Check
//                                                                 className={cn(
//                                                                     "mr-auto w-4",
//                                                                     productInfo?.id ===
//                                                                         prdouctID
//                                                                         ? "opacity-100"
//                                                                         : "opacity-0"
//                                                                 )}
//                                                             ></Check>
//                                                             {/* {productInfo?.price} */}
//                                                         </CommandItem>
//                                                     </div>
//                                                 ))}
//                                             </CommandGroup>
//                                         </CommandList>
//                                     </Command>
//                                 </PopoverContent>
//                             </Popover>
//                             <div>
//                                 <label htmlFor="quantity">الكمية</label>
//                                 <Input
//                                     type="number"
//                                     onChange={(e) =>
//                                         setQuantity(e.target.valueAsNumber)
//                                     }
//                                 />
//                             </div>
//                             <Button
//                                 variant={"default"}
//                                 onClick={ProductionEvent}
//                                 className="mt-auto"
//                             >
//                                 حفظ
//                             </Button>
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ProductionEvent;
