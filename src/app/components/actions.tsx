import { User } from "lucide-react";
import React from "react";

const Actions = () => {
    const GridItem = ({ menu }: { menu: { label: String; icon?: any } }) => (
        <div className="   rounded-md group-hover:bg-primary gro">
            <div className="group flex flex-col items-center justify-center h-auto p-2  ">
                <span>
                    {React.createElement(menu?.icon, {
                        size: "50",
                    })}
                </span>
                <span className="text-xs font-bold">اضافة عميل</span>
            </div>
        </div>
    );

    const data: { label: String; icon?: any }[] = [
        {
            label: "اضافة عميل",
            icon: User,
        },
        {
            label: "اضافة عميل",
            icon: User,
        },
        {
            label: "اضافة عميل",
            icon: User,
        },
        {
            label: "اضافة عميل",
            icon: User,
        },
        {
            label: "اضافة عميل",
            icon: User,
        },
    ];
    const items: any = [];

    data.map((menu, index) => {
        items.push(<GridItem key={index} menu={menu} />);
    });

    return (
        <div className="grid grid-cols-4 w-fit mt-3 gap-5  p-5 rounded-lg  backdrop-blur-xl text-white     items-center justify-items-center">
            {items}
        </div>
    );
};

export default Actions;
