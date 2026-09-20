import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { SectionTitle, StatusPill } from "@/components/workpass/SharedUI";
import { BadgeCheck, Check, CircleAlert, Fingerprint, LockKeyhole, QrCode, RefreshCw, ScanLine, ShieldCheck, X } from "lucide-react";

export function VerifierView() {
  const verifyMutation = trpc.workpass.verify.useMutation();
  const [verified, setVerified] = useState<boolean | null>(null);
  const [tampered, setTampered] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const runVerify = async (isTampered: boolean) => { 
    setLoading(true); 
    setTampered(isTampered); 
    const result = await verifyMutation.mutateAsync({ tampered: isTampered }); 
    setVerified(result.valid); 
    setLoading(false); 
  };
  
  return (
    <div className="space-y-8 pb-10">
      <SectionTitle eyebrow="Independent verification" title="Trust the claim, not the story." description="A lender can check a WorkPass presentation in one tap — and only sees what the worker chose to reveal." action={<StatusPill tone="emerald" icon={ShieldCheck}>Verifier portal</StatusPill>} />
      
      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[28px] bg-[#fffdf9] p-6 shadow-[0_12px_30px_rgba(24,32,53,0.06)] ring-1 ring-ink/10 sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Incoming proof</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">XYZ Finance</h3>
            </div>
            <div className="rounded-2xl bg-ink p-3 text-saffron"><QrCode className="h-5 w-5" /></div>
          </div>
          
          <div className="mt-7 rounded-2xl border border-ink/8 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/14 text-[#9b6816]">
                <Fingerprint className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[12px] font-bold text-ink">John S.</div>
                <div className="mt-1 text-[10px] text-ink/40">WorkPass credential · Loan purpose</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-ink/[0.035] p-3">
                <div className="text-[10px] text-ink/40">Presentation</div>
                <div className="mt-1 text-[11px] font-bold text-ink">WP-LOAN-8F2A</div>
              </div>
              <div className="rounded-xl bg-ink/[0.035] p-3">
                <div className="text-[10px] text-ink/40">Expires</div>
                <div className="mt-1 text-[11px] font-bold text-ink">24 hours</div>
              </div>
            </div>
          </div>
          
          {verified === null ? (
            <button type="button" onClick={() => runVerify(false)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-[12px] font-bold text-white transition hover:bg-[#273653]">
              Verify presentation <ScanLine className="h-4 w-4 text-saffron" />
            </button>
          ) : (
            <button type="button" onClick={() => { setVerified(null); setTampered(false); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-[12px] font-bold text-ink/65 transition hover:border-ink/20 hover:text-ink">
              <RefreshCw className="h-4 w-4" /> Reset demo
            </button>
          )}
        </div>
        
        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Verification result</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">What the lender can see</h3>
            </div>
            {verified !== null ? (
              <StatusPill tone={verified ? "emerald" : "rose"} icon={verified ? Check : X}>
                {verified ? "Valid presentation" : "Verification failed"}
              </StatusPill>
            ) : (
              <StatusPill tone="slate">Waiting for scan</StatusPill>
            )}
          </div>
          
          {verified === null ? (
            <div className="flex min-h-[270px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/12 bg-ink/[0.018] text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-ink/30">
                <ScanLine className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-semibold text-ink/55">Scan or paste a presentation</p>
              <p className="mt-2 max-w-xs text-[11px] leading-5 text-ink/35">You’ll see only the claims John consented to share.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div className={cn("rounded-2xl p-4", verified ? "bg-mint/8" : "bg-rose-50")}>
                <div className={cn("flex items-center gap-2 text-[12px] font-bold", verified ? "text-mint" : "text-rose-700")}>
                  <ShieldCheck className="h-4 w-4" />
                  {verified ? "Signature valid · Not expired · Not revoked" : "Signature mismatch · Claim may have been changed"}
                </div>
                <p className="mt-2 text-[11px] leading-5 text-ink/50">
                  {verified ? "This proof is bound to John’s wallet and was created for XYZ Finance." : "The verifier rejected the presentation because its claim digest no longer matches the signed credential."}
                </p>
              </div>
              
              {verified ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-ink/8 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Monthly income</span>
                        <BadgeCheck className="h-4 w-4 text-mint" />
                      </div>
                      <div className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">₹15–20k</div>
                      <div className="mt-1 text-[10px] text-ink/40">Derived band · 6 months</div>
                    </div>
                    <div className="rounded-2xl border border-ink/8 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Work history</span>
                        <BadgeCheck className="h-4 w-4 text-mint" />
                      </div>
                      <div className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">8 months</div>
                      <div className="mt-1 text-[10px] text-ink/40">Consistency · 86%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-ink/8 pt-4 text-[10px] text-ink/35">
                    <LockKeyhole className="h-3.5 w-3.5 text-mint" /> Hidden: customer names · raw payments · job list
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => runVerify(false)} className="text-[11px] font-bold text-ink underline decoration-ink/20 underline-offset-4">Restore original credential</button>
              )}
            </div>
          )}
          
          <div className="mt-6 border-t border-ink/8 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-bold text-ink/60">
                <CircleAlert className="h-4 w-4 text-saffron" /> Tamper test
              </div>
              <button type="button" onClick={() => runVerify(true)} disabled={loading} className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-[10px] font-bold text-ink/55 transition hover:border-ink/20 hover:text-ink">
                {loading ? "Checking…" : "Edit a claim"}
              </button>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-ink/35">Try changing ₹15–20k to ₹25–30k. The signature will no longer match.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
