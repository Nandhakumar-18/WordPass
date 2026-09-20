import { useState } from "react";
import { Sidebar, TopBar, View } from "@/components/workpass/Navigation";
import { WorkerView } from "./views/WorkerView";
import { CustomerView } from "./views/CustomerView";
import { VerifierView } from "./views/VerifierView";
import { ReviewView } from "./views/ReviewView";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("worker");
  
  const setView = (view: View) => { 
    setActiveView(view); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };
  
  return (
    <div className="min-h-screen bg-[#f8f6f1] text-ink">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar activeView={activeView} onSelect={setView} />
        <main className="min-w-0 flex-1 bg-[#fcfbf8]">
          <TopBar activeView={activeView} />
          <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            {activeView === "worker" && <WorkerView onGoToCustomer={() => setView("customer")} onGoToVerifier={() => setView("verifier")} />}
            {activeView === "customer" && <CustomerView />}
            {activeView === "verifier" && <VerifierView />}
            {activeView === "review" && <ReviewView />}
          </div>
        </main>
      </div>
    </div>
  );
}
