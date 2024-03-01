"use client";
import { FaUser } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";

import React from "react";
import { AiOutlineCustomerService } from "react-icons/ai";
import useInvoice from "@/lib/zustand";

const Actions = () => {
    const Store = useInvoice();
    const GridItem = ({
        menu,
    }: {
        menu: { label: String; icon?: any; func?: () => void };
    }) => (
        <div
            className=" flex flex-col items-center justify-center h-auto p-2 border  border-stone-300 w-full bg-white text-black hover:bg-slate-700 hover:text-white hover:cursor-pointer hover:select-none"
            onClick={() => {
                menu?.func ? menu?.func() : null;
            }}
        >
            <span>
                {React.createElement(menu?.icon, {
                    size: "40",
                })}
            </span>
            <span className="text-xs mt-2 whitespace-nowrap w-fit text-center">
                {menu.label}
            </span>
        </div>
    );

    const data: { label: String; icon?: any; func?: () => void }[] = [
        {
            label: "اضافة عميل",
            icon: FaUser,
            func: () => {
                console.log("clicked");

                Store.SetAddcustomerModalIsOpen(true);
            },
        },
        {
            label: "انشاء فاتورة بيع",
            icon: FaFileInvoice,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
        {
            label: "اضافة عميل",
            icon: FaUser,
        },
    ];
    const items: any = data.map((menu, index) => {
        return <GridItem key={index} menu={menu} />;
    });

    // data.map((menu, index) => {
    //     items.push(<GridItem key={index} menu={menu} />);
    // });

    return (
        <div className="p-2">
            <div>إجراءات عاجلة</div>
            <div className="grid grid-cols-4   w-[400px] border-collapse rounded-lg  backdrop-blur-xl text-white 0  bg-white   items-center justify-items-center">
                {items}
            </div>
        </div>
    );
};

export default Actions;
