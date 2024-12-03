"use client";

const InvoiceSkeleton = () => {
    return (
        <>
            <div className="h-full max-w-3xl w-full p-5 mx-auto font-semibold whitespace-nowrap border print:w-full print:h-screen border-stone-300 animate-pulse">
                <div className="relative flex flex-col items-center justify-center sm:py-5 py-2 border-black border-y-2">
                    <div className="sm:text-4xl text-2xl animate-pulse bg-gray-100">
                        Sales Invoice
                    </div>
                </div>
                <div className="flex sm:flex-row flex-col justify-between w-full py-5 mb-4 border-b-2 border-black">
                    <div className="flex flex-col sm:gap-4 order-2 sm:order-1 gap-1 sm:w-[60%]">
                        <div className="flex sm:pr-4 text-lg ">
                            <label className="w-[102px] animate-pulse">
                                Customer Name
                            </label>
                            <div className="text-lg rounded-md w-fit">: </div>
                        </div>
                        <div className="flex sm:pr-4 text-lg">
                            <label className="w-[102px] ">Invoice Date</label>
                            <div className="rounded-md w-fit ">
                                :<span className="pr-2"></span>
                            </div>
                        </div>
                    </div>
                    <div className="flex sm:flex-col order-1  sm:items-center justify-center gap-1 sm:ml-8 text-lg "></div>
                </div>
                {/* items */}
                <div className=" p-2 border border-black overflow-hidden sm:border-none">
                    <div className="overflow-x-auto  sm:w-full print:w-full mx-auto">
                        <table className="table min-w-[500px] sm:w-full mx-auto ">
                            {/* head */}
                            <thead>
                                <tr className="bg-orange-300">
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[5%] py-1 px-1"
                                    >
                                        #
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[65%] py-1 px-3"
                                    >
                                        Description
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        Quantity
                                    </th>
                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        Price
                                    </th>

                                    <th
                                        align="center"
                                        className="text-lg text-black border border-black w-[10%] py-1 px-3"
                                    >
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th
                                        align="center"
                                        className=" text-black font-semibold border border-black h-[29px] px-1"
                                    ></th>
                                    <th
                                        align="right"
                                        className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-right"
                                    ></th>

                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black telg"
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                </tr>
                                <tr>
                                    <th
                                        align="center"
                                        className=" text-black font-semibold border border-black h-[29px] px-1"
                                    ></th>
                                    <th
                                        align="right"
                                        className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-right"
                                    ></th>

                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black telg"
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                </tr>
                                <tr>
                                    <th
                                        align="center"
                                        className=" text-black font-semibold border border-black h-[29px] px-1"
                                    ></th>
                                    <th
                                        align="right"
                                        className="px-3 font-semibold text-black border border-black whitespace-pre-wrap text-center sm:text-right"
                                    ></th>

                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black telg"
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                    <td
                                        align="center"
                                        className="px-3 font-semibold text-black border border-black "
                                    ></td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th
                                        colSpan={3}
                                        align="left"
                                        className="text-lg text-black border border-black"
                                    >
                                        Total Invoice
                                    </th>

                                    <td
                                        colSpan={2}
                                        align="center"
                                        className="text-lg text-black bg-orange-300 border border-black"
                                    >
                                        EGP
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoiceSkeleton;
