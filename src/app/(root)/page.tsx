import LoadingPage from "@/components/loadingComp";
import RedirectCompLayout from "./Redirect";
import { AddNewOrgModal } from "@/components/modals/AddNewOrgModal";
export default async function RootPage() {
    return (
        <div>
            <AddNewOrgModal />
            <RedirectCompLayout />
            <LoadingPage />
        </div>
    );
}
