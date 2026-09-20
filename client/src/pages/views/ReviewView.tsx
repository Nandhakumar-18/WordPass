import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SectionTitle, StatusPill } from "@/components/workpass/SharedUI";
import { ChevronRight, CircleAlert, Network, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

export function ReviewView() {
  const fraudQuery = trpc.workpass.getFraudFlags.useQuery();
  const [expanded, setExpanded] = useState(false);
  const flag = fraudQuery.data?.[0];
  
  return (
    <div className="space-y-8 pb-10">
      <SectionTitle eyebrow="Human-in-the-loop review" title="Signals, not verdicts." description="Suspicious patterns go to review with a reason the worker can understand and contest." action={<StatusPill tone="amber" icon={CircleAlert}>1 needs review</StatusPill>} />
      
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Flagged pattern</p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">Possible confirmation ring</h3>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Network className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-6 rounded-2xl bg-[#f8f6f1] p-5">
            <div className="relative mx-auto h-44 max-w-[360px]">
              <div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 -rotate-[18deg] bg-saffron/45" />
              <div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 rotate-[22deg] bg-saffron/45" />
              <div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 rotate-90 bg-saffron/45" />
              <div className="absolute left-[calc(50%-28px)] top-[calc(50%-28px)] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white shadow-lg">John</div>
              <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-saffron text-[9px] font-bold text-ink shadow">C-01</div>
              <div className="absolute right-5 top-7 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-mint text-[9px] font-bold text-white shadow">C-02</div>
              <div className="absolute bottom-4 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-rose-400 text-[9px] font-bold text-white shadow">C-03</div>
            </div>
            <div className="mt-2 text-center text-[10px] font-semibold text-ink/40">3 new accounts · 11 confirmations · 14 days</div>
          </div>
          
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-amber-50 p-1.5 text-amber-700">
                <CircleAlert className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-ink">Why this was flagged</div>
                <div className="mt-1 text-[11px] leading-5 text-ink/45">
                  {flag?.reason ?? "Three customer accounts were created recently and only confirm this worker."}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-mint/10 p-1.5 text-mint">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-ink">What happens next</div>
                <div className="mt-1 text-[11px] leading-5 text-ink/45">
                  The work stays in the passport as needs review. John can add payment proof or another customer confirmation.
                </div>
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => setExpanded(!expanded)} className="mt-6 flex items-center gap-2 text-[11px] font-bold text-ink/55 underline decoration-ink/15 underline-offset-4">
            {expanded ? "Hide review notes" : "View review notes"}
            <ChevronRight className={cn("h-3.5 w-3.5 transition", expanded && "rotate-90")} />
          </button>
          
          {expanded ? (
            <div className="mt-3 rounded-xl bg-ink/[0.035] p-3 text-[10px] leading-5 text-ink/45">
              No protected attributes are used in this signal. Income seasonality is not scored as suspicious. This review can be appealed by the worker.
            </div>
          ) : null}
        </div>
        
        <div className="space-y-4">
          <div className="rounded-[26px] bg-ink p-6 text-white shadow-[0_14px_30px_rgba(24,32,53,0.12)]">
            <div className="flex items-center gap-2 text-saffron">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Fairness promise</span>
            </div>
            <h3 className="mt-5 max-w-xs font-display text-2xl font-semibold leading-tight tracking-[-0.045em]">A flag is a question, not a rejection.</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Every decision comes with a reason, an appeal path, and a human review option.</p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white/8 p-3">
                <div className="font-display text-xl font-semibold">0</div>
                <div className="mt-1 text-[10px] text-white/40">auto-rejections</div>
              </div>
              <div className="rounded-2xl bg-white/8 p-3">
                <div className="font-display text-xl font-semibold">100%</div>
                <div className="mt-1 text-[10px] text-white/40">reason shown</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-[26px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Review queue</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">1 open signal</h3>
              </div>
              <button type="button" onClick={() => toast.success("Queue refreshed", { description: "No new signals found." })} className="rounded-xl border border-ink/10 p-2 text-ink/45 transition hover:border-ink/20 hover:text-ink">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/45 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Network className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold text-ink">Confirmation ring</div>
                <div className="mt-1 text-[10px] text-ink/40">John S. · low severity</div>
              </div>
              <ChevronRight className="h-4 w-4 text-ink/25" />
            </div>
            
            <button type="button" onClick={() => toast("Review workflow", { description: "Appeal and evidence collection controls are ready for the next sprint." })} className="mt-4 w-full rounded-xl border border-ink/10 px-4 py-3 text-[11px] font-bold text-ink/60 transition hover:border-ink/20 hover:text-ink">
              Open case details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
