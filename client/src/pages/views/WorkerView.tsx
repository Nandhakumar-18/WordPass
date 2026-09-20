import { useState } from "react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  FileCheck2,
  Headphones,
  Languages,
  LockKeyhole,
  Mic,
  MoreHorizontal,
  QrCode,
  Radio,
  ShieldCheck,
  TrendingUp,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { SectionTitle, StatusPill, TrustMeter } from "@/components/workpass/SharedUI";

const jobs = [
  { id: "job-1", type: "AC service", customer: "Sharma ji", amount: "₹1,200", date: "Today", evidence: "L2", color: "bg-emerald-100 text-emerald-700" },
  { id: "job-2", type: "Wiring repair", customer: "Meena R.", amount: "₹850", date: "Yesterday", evidence: "L1", color: "bg-sky-100 text-sky-700" },
  { id: "job-3", type: "Fan installation", customer: "Anita K.", amount: "₹600", date: "17 Sep", evidence: "L2", color: "bg-amber-100 text-amber-700" },
  { id: "job-4", type: "AC service", customer: "Ravi P.", amount: "₹1,800", date: "15 Sep", evidence: "L3", color: "bg-violet-100 text-violet-700" },
];

const weeklyBars = [42, 58, 47, 72, 64, 88, 76, 93, 68, 84, 78, 96];

export function WorkerView({ onGoToCustomer, onGoToVerifier }: { onGoToCustomer: () => void; onGoToVerifier: () => void }) {
  const passportQuery = trpc.workpass.getPassport.useQuery();
  const voiceMutation = trpc.workpass.recordVoice.useMutation();
  const confirmMutation = trpc.workpass.confirmJob.useMutation();
  const shareMutation = trpc.workpass.createPresentation.useMutation();
  const utils = trpc.useUtils();
  const [listening, setListening] = useState(false);
  const [pendingJob, setPendingJob] = useState<{ id: string; type: string; amount: string; customer: string } | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [shareCreated, setShareCreated] = useState(false);

  const passport = passportQuery.data;
  const score = passport?.score ?? 82;
  const evidenceCount = passport?.evidenceCount ?? 38;

  const listen = () => {
    setListening(true);
    window.setTimeout(async () => {
      const result = await voiceMutation.mutateAsync({ transcript: "Aaj Sharma ji ke ghar do AC service, 1200 mila." });
      setPendingJob(result.job);
      setListening(false);
      toast.success("We heard a new job", { description: "Check the details before saving it to your passport." });
    }, 900);
  };

  const confirmParse = async () => {
    if (!pendingJob) return;
    await confirmMutation.mutateAsync({ jobId: pendingJob.id });
    await utils.workpass.getPassport.invalidate();
    toast.success("Job added to your passport", { description: "It is ready for customer confirmation." });
    setPendingJob(null);
    onGoToCustomer();
  };

  const createShare = async () => {
    const result = await shareMutation.mutateAsync({ purpose: "loan" });
    setShareCreated(true);
    toast.success("Loan proof created", { description: `Expires in ${result.expiresInHours} hours.` });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <SectionTitle eyebrow="Your portable proof" title="Good morning, John." description="One place to see what your work can prove — without handing over your whole history." />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => toast("Language set to Tamil + English", { description: "Voice prompts will follow your choice." })} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-[11px] font-semibold text-ink/65 transition hover:border-ink/20 hover:text-ink"><Languages className="h-4 w-4" /> தமிழ் / English</button>
          <button type="button" onClick={() => toast("Read-aloud ready", { description: "Tap the speaker button on any explanation." })} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-[11px] font-semibold text-ink/65 transition hover:border-ink/20 hover:text-ink"><Headphones className="h-4 w-4" /> Listen</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="relative overflow-hidden rounded-[28px] bg-ink p-6 text-white shadow-[0_18px_40px_rgba(24,32,53,0.14)] sm:p-8">
          <div className="absolute -right-16 -top-20 h-60 w-60 rounded-full border border-white/10" />
          <div className="absolute -right-4 -top-8 h-40 w-40 rounded-full border border-saffron/20" />
          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-md">
              <div className="flex items-center gap-2"><StatusPill tone="emerald" icon={ShieldCheck}>Passport active</StatusPill><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">Updated just now</span></div>
              <h3 className="mt-5 font-display text-3xl font-semibold tracking-[-0.055em] sm:text-[39px]">Your work has a <span className="text-saffron">signal.</span></h3>
              <p className="mt-4 text-sm leading-6 text-white/60">{passport?.explanation ?? "38 different customers confirmed your work. Payments matched on 91% of jobs. You have worked steadily for 8 months."}</p>
              <button type="button" onClick={() => toast("Score breakdown", { description: "Evidence 35 · Customer diversity 21 · Consistency 16 · Tenure 6 · Payments 4" })} className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold text-white underline decoration-white/20 underline-offset-4">See how this is calculated <ArrowUpRight className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex items-center gap-5 self-start sm:self-auto"><TrustMeter score={score} /><div className="min-w-[86px]"><div className="font-display text-xl font-semibold text-white">Strong</div><div className="mt-1 text-[11px] leading-5 text-white/45">Built from evidence, not a black box.</div></div></div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[28px] border border-ink/10 bg-[#fffdf9] p-6 shadow-[0_12px_30px_rgba(24,32,53,0.05)] sm:p-7">
          <div>
            <div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Build your proof</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Log a job</h3></div><div className="rounded-2xl bg-mint/10 p-3 text-mint"><Mic className="h-5 w-5" /></div></div>
            <p className="mt-4 max-w-[270px] text-sm leading-6 text-ink/50">Say what you did, in your language. We’ll make the record clear before anything is saved.</p>
          </div>
          {pendingJob ? (
            <div className="mt-6 rounded-2xl border border-saffron/25 bg-saffron/8 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#996313]">Check this record</p><p className="mt-2 text-sm font-semibold text-ink">{pendingJob.type} · {pendingJob.amount}</p><p className="mt-1 text-[11px] text-ink/45">Customer hint: {pendingJob.customer}</p></div><button type="button" onClick={() => setPendingJob(null)} className="text-ink/35 hover:text-ink"><X className="h-4 w-4" /></button></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={confirmParse} className="rounded-xl bg-ink px-3 py-2.5 text-[11px] font-bold text-white transition hover:bg-ink/90">Looks right <Check className="ml-1 inline h-3.5 w-3.5" /></button><button type="button" onClick={() => toast("Correction mode", { description: "You can edit the amount or job type before saving." })} className="rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-[11px] font-bold text-ink/60 transition hover:border-ink/20">Edit details</button></div></div>
          ) : (
            <button type="button" onClick={listen} disabled={listening} className={cn("group mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-white transition-all active:scale-[0.98]", listening ? "bg-mint" : "bg-ink hover:bg-[#273653]")}>
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", listening ? "bg-white/20" : "bg-saffron/15")}>{listening ? <Radio className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4 text-saffron" />}</span>{listening ? "Listening…" : "Tap to speak"}<ChevronRight className="ml-auto h-4 w-4 text-white/35 transition group-hover:translate-x-0.5" />
            </button>
          )}
          <div className="mt-3 flex items-center gap-2 text-[10px] text-ink/35"><LockKeyhole className="h-3 w-3" /> Audio stays on your phone. Only the record moves forward.</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Verified jobs", value: evidenceCount.toString(), note: "+6 this month", icon: BriefcaseBusiness, color: "text-mint", bg: "bg-mint/10" },
          { label: "Income band", value: "₹15–20k", note: "6 months covered", icon: TrendingUp, color: "text-saffron", bg: "bg-saffron/12" },
          { label: "Unique customers", value: "38", note: "across 4 categories", icon: UsersRound, color: "text-sky-600", bg: "bg-sky-100" },
          { label: "Consistency", value: "86%", note: "active weeks", icon: Zap, color: "text-violet-600", bg: "bg-violet-100" },
        ].map((metric) => {
          const Icon = metric.icon;
          return <div key={metric.label} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_8px_20px_rgba(24,32,53,0.035)]"><div className="flex items-start justify-between"><div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", metric.bg, metric.color)}><Icon className="h-4 w-4" /></div><MoreHorizontal className="h-4 w-4 text-ink/25" /></div><div className="mt-5 font-display text-[27px] font-semibold tracking-[-0.05em] text-ink">{metric.value}</div><div className="mt-1 text-[11px] font-semibold text-ink/55">{metric.label}</div><div className="mt-2 text-[10px] text-ink/35">{metric.note}</div></div>;
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Your activity</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">Evidence is getting stronger</h3></div><StatusPill tone="emerald" icon={TrendingUp}>+12% this month</StatusPill></div>
          <div className="mt-8 flex h-36 items-end gap-2 border-b border-ink/8 pb-0 sm:gap-3">{weeklyBars.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={cn("w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80", index > 8 ? "bg-mint" : "bg-ink/12")} style={{ height: `${height}%` }} />{index === 11 ? <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-ink px-1.5 py-1 text-[9px] font-bold text-white">₹18.4k</div> : null}</div>)}</div>
          <div className="mt-3 flex justify-between text-[10px] font-medium text-ink/35"><span>6 weeks ago</span><span>Today</span></div>
        </div>
        <div className="rounded-[26px] border border-ink/10 bg-[#fffdf9] p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7">
          <div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Next best step</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">Make your proof travel</h3></div><div className="rounded-xl bg-saffron/12 p-2.5 text-[#a96d14]"><QrCode className="h-5 w-5" /></div></div>
          <p className="mt-5 text-sm leading-6 text-ink/55">Share an income band and tenure with a lender — not your full transaction history.</p>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-saffron"><LockKeyhole className="h-4 w-4" /></div><div className="flex-1"><div className="text-[11px] font-bold text-ink">Loan proof</div><div className="mt-1 text-[10px] text-ink/40">Income band · 6 months tenure</div></div><Check className="h-4 w-4 text-mint" /></div>
          <button type="button" onClick={() => { setShowShare(true); setShareCreated(false); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-[11px] font-bold text-white transition hover:bg-[#273653]">Review what to share <ArrowUpRight className="h-4 w-4 text-saffron" /></button>
          {showShare ? <ShareSheet created={shareCreated} onClose={() => setShowShare(false)} onCreate={createShare} onGoToVerifier={onGoToVerifier} /> : null}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Recent proof</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">Your latest jobs</h3></div><button type="button" onClick={onGoToCustomer} className="flex items-center gap-1 text-[11px] font-bold text-ink/55 transition hover:text-ink">See confirmation view <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
        <div className="overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-[0_8px_20px_rgba(24,32,53,0.035)]">{jobs.map((job, index) => <div key={job.id} className={cn("flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6", index !== jobs.length - 1 && "border-b border-ink/8")}><div className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-bold", job.color)}>{job.type.split(" ").map((part) => part[0]).join("")}</div><div className="min-w-[135px] flex-1"><div className="text-[12px] font-bold text-ink">{job.type}</div><div className="mt-1 text-[10px] text-ink/40">{job.customer} · {job.date}</div></div><div className="text-right"><div className="text-[12px] font-bold text-ink">{job.amount}</div><div className="mt-1 text-[10px] text-ink/40">{job.evidence === "L3" ? "Platform verified" : job.evidence === "L2" ? "Customer confirmed" : "Payment matched"}</div></div><StatusPill tone={job.evidence === "L2" ? "emerald" : job.evidence === "L3" ? "saffron" : "sky"} icon={job.evidence === "L2" ? Check : job.evidence === "L3" ? BadgeCheck : FileCheck2}>{job.evidence}</StatusPill><ChevronRight className="h-4 w-4 text-ink/25" /></div>)}</div>
      </div>
    </div>
  );
}

function ShareSheet({ created, onClose, onCreate, onGoToVerifier }: { created: boolean; onClose: () => void; onCreate: () => void; onGoToVerifier: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 p-4 backdrop-blur-sm sm:items-center"><div className="w-full max-w-md rounded-[28px] bg-[#fffdf9] p-6 shadow-2xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Purpose-bound share</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Loan proof</h3></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-ink/40 hover:bg-ink/5 hover:text-ink"><X className="h-5 w-5" /></button></div><p className="mt-3 text-sm leading-6 text-ink/50">The verifier sees your derived claims — never the jobs behind them.</p><div className="mt-6 space-y-2">{[["Monthly income band", "₹15–20k", true], ["Work history", "6 months", true], ["Customer names", "Not shared", false], ["Raw transactions", "Not shared", false]].map(([label, value, enabled]) => <div key={label as string} className="flex items-center justify-between rounded-2xl border border-ink/8 bg-white px-4 py-3"><div className="flex items-center gap-3"><div className={cn("h-2 w-2 rounded-full", enabled ? "bg-mint" : "bg-ink/15")} /><span className="text-[12px] font-semibold text-ink/70">{label as string}</span></div><span className={cn("text-[11px] font-bold", enabled ? "text-mint" : "text-ink/35")}>{value as string}</span></div>)}</div>{created ? <div className="mt-5 rounded-2xl bg-mint/10 p-4"><div className="flex items-center gap-2 text-[12px] font-bold text-mint"><BadgeCheck className="h-4 w-4" /> Credential ready to verify</div><div className="mt-2 text-[10px] leading-5 text-ink/50">One-time QR · expires in 24 hours · shared with XYZ Finance</div><button type="button" onClick={onGoToVerifier} className="mt-3 text-[11px] font-bold text-ink underline decoration-ink/20 underline-offset-4">Open verifier view <ArrowUpRight className="ml-1 inline h-3 w-3" /></button></div> : <button type="button" onClick={onCreate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-[12px] font-bold text-white transition hover:bg-[#273653]">Create secure QR <QrCode className="h-4 w-4 text-saffron" /></button>}</div></div>;
}
