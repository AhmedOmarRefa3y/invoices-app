import { Suspense } from "react";
import JournalTransactionsClient from "./JournalTransactionsContent";
import Loading from "@/app/[locale]/loading";

export default function JournalTransactionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <JournalTransactionsClient />
    </Suspense>
  );
}
