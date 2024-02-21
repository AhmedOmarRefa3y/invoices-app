import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
        </div>
    );
}
