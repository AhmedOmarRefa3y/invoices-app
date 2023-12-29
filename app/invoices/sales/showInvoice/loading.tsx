import { Link } from "lucide-react";
import React from "react";
import { BsFillPrinterFill } from "react-icons/bs";
import Logo from "./Logo";

const Lodaing = () => {
    
    return (
        <>
            <div className=" mx-auto bg-slate-300 max-w-4xl print:w-full  p-5 print:bg-white    rounded font-semibold min-h-screen ">
                <Logo />
                <div className=" border-y-2 border-black flex items-center justify-center relative  py-5">
                    <div className="text-4xl">فاتورة مبدئية</div>
                    <Link className="mr-auto text-lg print:hidden bg-blue-400  p-2 rounded absolute left-0 hover:bg-blue-600 duration-300">
                        إذن التحميل
                    </Link>
                </div>
                <div className="flex mb-4 border-b-2  justify-between w-full border-black py-5">
                    <div className="flex flex-col gap-4 w-[60%]">
                        <div className="text-lg flex pr-4 ">
                            <label className="w-[102px]">اسم العميل </label>
                            <div className="w-fit  rounded-md text-lg">
                                : <span className="pr-2">loading...</span>
                            </div>
                        </div>
                        <div className="text-lg flex  pr-4">
                            <label className="w-[102px]">تاريخ الفاتورة</label>
                            <div className="w-fit  rounded-md ">
                                :<span className="pr-2">loading...</span>
                            </div>
                        </div>
                    </div>
                    <div className=" ml-8 text-lg flex flex-col gap-1 justify-center items-center ">
                        <div>
                            رقم الفاتورة :
                            <span className=" tracking-[3px] text-2xl">
                                loading...
                            </span>
                        </div>
                        <div className="flex mr-auto justify-end">
                            <button
                                className={`print:hidden  w-fit block  `}
                            ></button>
                            <button
                                className={`print:hidden  w-fit block  `}
                            ></button>
                            <button className="print:hidden  w-fit block">
                                <BsFillPrinterFill
                                    size={"40px"}
                                    className=" cursor-pointer hover:text-orange-500 duration-300"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto mt-4 w-[70%] print:w-full mx-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className="bg-orange-300">
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[5%]"
                                >
                                    م
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[65%]"
                                >
                                    البيان
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    الكمية
                                </th>
                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    السعر
                                </th>

                                <th
                                    align="center"
                                    className="text-lg text-black border border-black w-[10%]"
                                >
                                    القيمة
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th
                                    align="center"
                                    className="text-base text-black font-semibold border border-black"
                                >
                                    loading...
                                </th>
                                <th
                                    align="right"
                                    className="text-base text-black font-semibold border border-black"
                                >
                                    loading...
                                </th>

                                <td
                                    align="center"
                                    className="text-base text-black font-semibold border border-black"
                                >
                                    loading...
                                </td>
                                <td
                                    align="center"
                                    className="text-base text-black font-semibold border border-black"
                                >
                                    loading...
                                </td>
                                <td
                                    align="center"
                                    className="text-base text-black font-semibold border border-black"
                                >
                                    loading...
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th
                                    colSpan={3}
                                    align="left"
                                    className="text-lg text-black border border-black"
                                >
                                    إجمالي الفاتورة
                                </th>

                                <td
                                    colSpan={2}
                                    align="center"
                                    className="text-lg text-black border border-black bg-orange-300"
                                >
                                    loading...
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Lodaing;
