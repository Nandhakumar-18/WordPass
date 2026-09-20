import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SectionTitle, StatusPill } from "@/components/workpass/SharedUI";
import { ArrowUpRight, Check, CircleAlert, ClipboardCheck, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";

export function CustomerView() {
  const customerMutation = trpc.workpass.customerRespond.useMutation();
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<"confirm" | "different" | "didnt_happen" | null>(null);
  
  const submit = async (value: "confirm" | "different" | "didnt_happen") => {
    await customerMutation.mutateAsync({ jobId: "job-1", response: value });
    setResponse(value);
    setResponded(true);
    toast.success(value === "confirm" ? "Work confirmed" : "Your response was recorded", { description: value === "confirm" ? "John's proof is now stronger." : "The worker can review the response." });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-10">
      <SectionTitle eyebrow="No app needed" title="Confirm a job in under 10 seconds." description="Your quick confirmation helps a worker carry proof of the work they did — without exposing your details." action={<StatusPill tone="emerald" icon={LockKeyhole}>Private by design</StatusPill>} />
      
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] bg-ink p-7 text-white shadow-[0_18px_40px_rgba(24,32,53,0.14)]">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-white/10 p-3 text-saffron">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">One-time request</span>
          </div>
          <div className="mt-14 text-[11px] font-bold uppercase tracking-[0.16em] text-saffron">John says</div>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.05em]">She serviced 2 ACs at Sharma ji’s home.</h3>
          <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Date</div>
              <div className="mt-1 text-sm font-semibold">19 September 2026</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Amount</div>
              <div className="mt-1 text-sm font-semibold">₹1,200</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-8">
          {responded ? (
            <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-mint/12 text-mint">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Thank you for helping.</h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-ink/50">
                {response === "confirm" ? "This job now has customer-confirmed evidence. You can close this page." : "Your response is private and will be shown to the worker as a review signal."}
              </p>
              <button type="button" onClick={() => { setResponded(false); setResponse(null); }} className="mt-7 flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-2.5 text-[11px] font-bold text-ink/60 transition hover:border-ink/20 hover:text-ink">
                <RefreshCw className="h-3.5 w-3.5" /> Demo again
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/35">
                <ShieldCheck className="h-4 w-4 text-mint" /> Simple confirmation
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Did this happen?</h3>
              <p className="mt-3 text-sm leading-6 text-ink/50">Choose the answer that matches your memory. You can also add a rating.</p>
              
              <div className="mt-7 space-y-2">
                <button type="button" onClick={() => submit("confirm")} className="flex w-full items-center justify-between rounded-2xl border border-mint/20 bg-mint/8 px-4 py-4 text-left transition hover:border-mint/40 hover:bg-mint/12">
                  <span>
                    <span className="block text-[12px] font-bold text-ink">Yes, confirm this work</span>
                    <span className="mt-1 block text-[10px] text-ink/40">The amount and work look right</span>
                  </span>
                  <Check className="h-5 w-5 text-mint" />
                </button>
                <button type="button" onClick={() => submit("different")} className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-4 text-left transition hover:border-ink/20 hover:bg-ink/[0.02]">
                  <span>
                    <span className="block text-[12px] font-bold text-ink">Amount is different</span>
                    <span className="mt-1 block text-[10px] text-ink/40">Let John know so she can correct it</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-ink/30" />
                </button>
                <button type="button" onClick={() => submit("didnt_happen")} className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-4 text-left transition hover:border-ink/20 hover:bg-ink/[0.02]">
                  <span>
                    <span className="block text-[12px] font-bold text-ink">I don’t remember this</span>
                    <span className="mt-1 block text-[10px] text-ink/40">This will not automatically penalize anyone</span>
                  </span>
                  <CircleAlert className="h-5 w-5 text-ink/30" />
                </button>
              </div>
              
              <div className="mt-6 flex items-center gap-2 border-t border-ink/8 pt-5 text-[10px] text-ink/35">
                <LockKeyhole className="h-3.5 w-3.5 text-mint" /> Your phone number is not shared with lenders.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
