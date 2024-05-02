import LoadingPage from "@/components/loadingComp";
import RedirectCompLayout from "./Redirect";
export default async function RootPage() {
    return (
        <div>
            <LoadingPage />
            <RedirectCompLayout />
        </div>
    );
}
