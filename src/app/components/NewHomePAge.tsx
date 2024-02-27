"use client";
import { useIsClient } from "@uidotdev/usehooks";
import Actions from "./actions";

const NewHomePAge = () => {
    const isClient = useIsClient();
    if (!isClient) {
        return null;
    }

    return (
        <div className="w-full h-full ">
            <Actions />
        </div>
    );
};

export default NewHomePAge;
