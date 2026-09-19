import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Fingerprint,
  Globe2,
  Headphones,
  HelpCircle,
  History,
  Languages,
  LockKeyhole,
  Mic,
  MoreHorizontal,
  Network,
  Pause,
  Play,
  QrCode,
  Radio,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  UsersRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type View = "worker" | "customer" | "verifier" | "review";

type NavItem = {
  id: View;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "worker", label: "Lakshmi's passport", hint: "Worker view", icon: WalletCards },
  { id: "customer", label: "Confirm a job", hint: "Customer view", icon: ClipboardCheck },
  { id: "verifier", label: "Verify a claim", hint: "Lender view", icon: ScanLine },
  { id: "review", label: "Review signals", hint: "NGO / admin", icon: Network },
];

const trustStyles = {
  Strong: { tone: "emerald", label: "Strong", score: 82 },
  Fair: { tone: "amber", label: "Fair", score: 61 },
  Building: { tone: "sky", label: "Building", score: 44 },
  Excellent: { tone: "violet", label: "Excellent", score: 95 },
} as const;

const jobs = [
  { id: "job-1", type: "AC service", customer: "Sharma ji", amount: "₹1,200", date: "Today", evidence: "L2", color: "bg-emerald-100 text-emerald-700" },
  { id: "job-2", type: "Wiring repair", customer: "Meena R.", amount: "₹850", date: "Yesterday", evidence: "L1", color: "bg-sky-100 text-sky-700" },
  { id: "job-3", type: "Fan installation", customer: "Anita K.", amount: "₹600", date: "17 Sep", evidence: "L2", color: "bg-amber-100 text-amber-700" },
  { id: "job-4", type: "AC service", customer: "Ravi P.", amount: "₹1,800", date: "15 Sep", evidence: "L3", color: "bg-violet-100 text-violet-700" },
];

const weeklyBars = [42, 58, 47, 72, 64, 88, 76, 93, 68, 84, 78, 96];

function AppMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-ink text-white shadow-[0_8px_20px_rgba(24,32,53,0.18)]">
      <div className="absolute left-[11px] top-[10px] h-[20px] w-[13px] rounded-[6px] border-2 border-saffron" />
      <div className="absolute bottom-[8px] right-[8px] h-2 w-2 rounded-full bg-mint" />
    </div>
  );
}

function IconButton({ icon: Icon, label, onClick, active = false }: { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 active:scale-[0.97]",
        active ? "border-ink/10 bg-ink text-white" : "border-ink/10 bg-white/70 text-ink/60 hover:border-ink/20 hover:bg-white hover:text-ink",
      )}
    >
      <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
    </button>
  );
}

function StatusPill({ children, tone = "slate", icon: Icon }: { children: React.ReactNode; tone?: "emerald" | "amber" | "slate" | "saffron" | "rose" | "sky"; icon?: LucideIcon }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/10",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
    saffron: "bg-saffron/10 text-[#996313] ring-saffron/20",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/10",
    sky: "bg-sky-50 text-sky-700 ring-sky-600/10",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1", tones[tone])}>
      {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-saffron">{eyebrow}</p>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-[28px]">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-sm leading-6 text-ink/55">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function TrustMeter({ score = 82 }: { score?: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative h-[142px] w-[142px] shrink-0">
      <svg viewBox="0 0 142 142" className="h-full w-full -rotate-90">
        <circle cx="71" cy="71" r={radius} fill="none" stroke="rgba(24,32,53,0.08)" strokeWidth="10" />
        <circle
          cx="71"
          cy="71"
          r={radius}
          fill="none"
          stroke="#2f9383"
          strokeLinecap="round"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[35px] font-semibold leading-none tracking-[-0.06em] text-ink">{score}</span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.17em] text-ink/45">trust score</span>
      </div>
    </div>
  );
}

function Sidebar({ activeView, onSelect }: { activeView: View; onSelect: (view: View) => void }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-ink/10 bg-[#f8f6f1] px-4 py-4 lg:min-h-screen lg:w-[258px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between lg:justify-start lg:gap-3">
        <div className="flex items-center gap-3">
          <AppMark />
          <div>
            <div className="font-display text-[17px] font-semibold tracking-[-0.03em] text-ink">workpass</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">proof, owned</div>
          </div>
        </div>
        <div className="hidden rounded-full bg-mint/15 px-2.5 py-1 text-[10px] font-bold text-mint lg:block">BETA</div>
      </div>

      <div className="mt-7 hidden lg:block">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/35">Workspace</p>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 active:scale-[0.99]",
                  active ? "bg-ink text-white shadow-[0_8px_18px_rgba(24,32,53,0.13)]" : "text-ink/55 hover:bg-white hover:text-ink",
                )}
              >
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", active ? "bg-white/10 text-saffron" : "bg-white text-ink/45 group-hover:text-ink")}>
                  <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold">{item.label}</span>
                  <span className={cn("mt-0.5 block text-[10px]", active ? "text-white/50" : "text-ink/35")}>{item.hint}</span>
                </span>
                {active ? <ChevronRight className="h-4 w-4 text-white/45" /> : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto hidden rounded-2xl border border-ink/8 bg-white p-3.5 lg:block">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-ink/65">
          <LockKeyhole className="h-3.5 w-3.5 text-mint" />
          Your data, your say
        </div>
        <p className="text-[11px] leading-5 text-ink/45">WorkPass only shares the claims you choose. Nothing here is a hidden score.</p>
        <button type="button" onClick={() => toast.success("Privacy guide opened", { description: "Your passport is worker-owned and purpose-bound." })} className="mt-3 flex items-center gap-1 text-[11px] font-bold text-ink underline decoration-ink/20 underline-offset-4">Read privacy guide <ArrowUpRight className="h-3 w-3" /></button>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-white/70 p-1 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={cn("flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-semibold", activeView === item.id ? "bg-ink text-white" : "text-ink/45")}>
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              <span className="max-w-[70px] truncate">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function TopBar({ activeView }: { activeView: View }) {
  const titles: Record<View, string> = { worker: "Worker passport", customer: "Confirm a job", verifier: "Verifier portal", review: "Review signals" };
  return (
    <header className="flex items-center justify-between border-b border-ink/10 px-5 py-4 sm:px-8 lg:px-10">
      <div className="flex items-center gap-2 text-[12px] text-ink/40">
        <span className="hidden sm:inline">WorkPass</span>
        <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
        <span className="font-semibold text-ink/70">{titles[activeView]}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full bg-mint/10 px-3 py-1.5 text-[10px] font-bold text-mint sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Demo mode</div>
        <IconButton icon={Bell} label="Notifications" onClick={() => toast("No new notifications", { description: "Your data sharing history is up to date." })} />
        <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/20 text-[12px] font-bold text-[#8d5d14]">LS</div>
      </div>
    </header>
  );
}

function WorkerView({ onGoToCustomer, onGoToVerifier }: { onGoToCustomer: () => void; onGoToVerifier: () => void }) {
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
        <SectionTitle eyebrow="Your portable proof" title="Good morning, Lakshmi." description="One place to see what your work can prove — without handing over your whole history." />
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

function CustomerView() {
  const customerMutation = trpc.workpass.customerRespond.useMutation();
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<"confirm" | "different" | "didnt_happen" | null>(null);
  const submit = async (value: "confirm" | "different" | "didnt_happen") => {
    await customerMutation.mutateAsync({ jobId: "job-1", response: value });
    setResponse(value);
    setResponded(true);
    toast.success(value === "confirm" ? "Work confirmed" : "Your response was recorded", { description: value === "confirm" ? "Lakshmi's proof is now stronger." : "The worker can review the response." });
  };
  return <div className="mx-auto max-w-3xl space-y-8 pb-10"><SectionTitle eyebrow="No app needed" title="Confirm a job in under 10 seconds." description="Your quick confirmation helps a worker carry proof of the work they did — without exposing your details." action={<StatusPill tone="emerald" icon={LockKeyhole}>Private by design</StatusPill>} /><div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><div className="rounded-[28px] bg-ink p-7 text-white shadow-[0_18px_40px_rgba(24,32,53,0.14)]"><div className="flex items-center justify-between"><div className="rounded-2xl bg-white/10 p-3 text-saffron"><ClipboardCheck className="h-6 w-6" /></div><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">One-time request</span></div><div className="mt-14 text-[11px] font-bold uppercase tracking-[0.16em] text-saffron">Lakshmi says</div><h3 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-[-0.05em]">She serviced 2 ACs at Sharma ji’s home.</h3><div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5"><div><div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Date</div><div className="mt-1 text-sm font-semibold">19 September 2026</div></div><div className="text-right"><div className="text-[10px] uppercase tracking-[0.15em] text-white/35">Amount</div><div className="mt-1 text-sm font-semibold">₹1,200</div></div></div></div><div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-8">{responded ? <div className="flex min-h-[330px] flex-col items-center justify-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-mint/12 text-mint"><Check className="h-8 w-8" /></div><h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Thank you for helping.</h3><p className="mt-3 max-w-xs text-sm leading-6 text-ink/50">{response === "confirm" ? "This job now has customer-confirmed evidence. You can close this page." : "Your response is private and will be shown to the worker as a review signal."}</p><button type="button" onClick={() => { setResponded(false); setResponse(null); }} className="mt-7 flex items-center gap-2 rounded-xl border border-ink/10 px-4 py-2.5 text-[11px] font-bold text-ink/60 transition hover:border-ink/20 hover:text-ink"><RefreshCw className="h-3.5 w-3.5" /> Demo again</button></div> : <><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/35"><ShieldCheck className="h-4 w-4 text-mint" /> Simple confirmation</div><h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">Did this happen?</h3><p className="mt-3 text-sm leading-6 text-ink/50">Choose the answer that matches your memory. You can also add a rating.</p><div className="mt-7 space-y-2"><button type="button" onClick={() => submit("confirm")} className="flex w-full items-center justify-between rounded-2xl border border-mint/20 bg-mint/8 px-4 py-4 text-left transition hover:border-mint/40 hover:bg-mint/12"><span><span className="block text-[12px] font-bold text-ink">Yes, confirm this work</span><span className="mt-1 block text-[10px] text-ink/40">The amount and work look right</span></span><Check className="h-5 w-5 text-mint" /></button><button type="button" onClick={() => submit("different")} className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-4 text-left transition hover:border-ink/20 hover:bg-ink/[0.02]"><span><span className="block text-[12px] font-bold text-ink">Amount is different</span><span className="mt-1 block text-[10px] text-ink/40">Let Lakshmi know so she can correct it</span></span><ArrowUpRight className="h-5 w-5 text-ink/30" /></button><button type="button" onClick={() => submit("didnt_happen")} className="flex w-full items-center justify-between rounded-2xl border border-ink/10 bg-white px-4 py-4 text-left transition hover:border-ink/20 hover:bg-ink/[0.02]"><span><span className="block text-[12px] font-bold text-ink">I don’t remember this</span><span className="mt-1 block text-[10px] text-ink/40">This will not automatically penalize anyone</span></span><CircleAlert className="h-5 w-5 text-ink/30" /></button></div><div className="mt-6 flex items-center gap-2 border-t border-ink/8 pt-5 text-[10px] text-ink/35"><LockKeyhole className="h-3.5 w-3.5 text-mint" /> Your phone number is not shared with lenders.</div></>}</div></div></div>;
}

function VerifierView() {
  const verifyMutation = trpc.workpass.verify.useMutation();
  const [verified, setVerified] = useState<boolean | null>(null);
  const [tampered, setTampered] = useState(false);
  const [loading, setLoading] = useState(false);
  const runVerify = async (isTampered: boolean) => { setLoading(true); setTampered(isTampered); const result = await verifyMutation.mutateAsync({ tampered: isTampered }); setVerified(result.valid); setLoading(false); };
  return <div className="space-y-8 pb-10"><SectionTitle eyebrow="Independent verification" title="Trust the claim, not the story." description="A lender can check a WorkPass presentation in one tap — and only sees what the worker chose to reveal." action={<StatusPill tone="emerald" icon={ShieldCheck}>Verifier portal</StatusPill>} /><div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]"><div className="rounded-[28px] bg-[#fffdf9] p-6 shadow-[0_12px_30px_rgba(24,32,53,0.06)] ring-1 ring-ink/10 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Incoming proof</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">XYZ Finance</h3></div><div className="rounded-2xl bg-ink p-3 text-saffron"><QrCode className="h-5 w-5" /></div></div><div className="mt-7 rounded-2xl border border-ink/8 bg-white p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-saffron/14 text-[#9b6816]"><Fingerprint className="h-5 w-5" /></div><div><div className="text-[12px] font-bold text-ink">Lakshmi S.</div><div className="mt-1 text-[10px] text-ink/40">WorkPass credential · Loan purpose</div></div></div><div className="mt-5 grid grid-cols-2 gap-2"><div className="rounded-xl bg-ink/[0.035] p-3"><div className="text-[10px] text-ink/40">Presentation</div><div className="mt-1 text-[11px] font-bold text-ink">WP-LOAN-8F2A</div></div><div className="rounded-xl bg-ink/[0.035] p-3"><div className="text-[10px] text-ink/40">Expires</div><div className="mt-1 text-[11px] font-bold text-ink">24 hours</div></div></div></div>{verified === null ? <button type="button" onClick={() => runVerify(false)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3.5 text-[12px] font-bold text-white transition hover:bg-[#273653]">Verify presentation <ScanLine className="h-4 w-4 text-saffron" /></button> : <button type="button" onClick={() => { setVerified(null); setTampered(false); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-[12px] font-bold text-ink/65 transition hover:border-ink/20 hover:text-ink"><RefreshCw className="h-4 w-4" /> Reset demo</button>}</div><div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7"><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Verification result</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">What the lender can see</h3></div>{verified !== null ? <StatusPill tone={verified ? "emerald" : "rose"} icon={verified ? Check : X}>{verified ? "Valid presentation" : "Verification failed"}</StatusPill> : <StatusPill tone="slate">Waiting for scan</StatusPill>}</div>{verified === null ? <div className="flex min-h-[270px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/12 bg-ink/[0.018] text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/5 text-ink/30"><ScanLine className="h-6 w-6" /></div><p className="mt-4 text-sm font-semibold text-ink/55">Scan or paste a presentation</p><p className="mt-2 max-w-xs text-[11px] leading-5 text-ink/35">You’ll see only the claims Lakshmi consented to share.</p></div> : <div className="mt-6 space-y-5"><div className={cn("rounded-2xl p-4", verified ? "bg-mint/8" : "bg-rose-50")}><div className={cn("flex items-center gap-2 text-[12px] font-bold", verified ? "text-mint" : "text-rose-700")}><ShieldCheck className="h-4 w-4" />{verified ? "Signature valid · Not expired · Not revoked" : "Signature mismatch · Claim may have been changed"}</div><p className="mt-2 text-[11px] leading-5 text-ink/50">{verified ? "This proof is bound to Lakshmi’s wallet and was created for XYZ Finance." : "The verifier rejected the presentation because its claim digest no longer matches the signed credential."}</p></div>{verified ? <><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-ink/8 p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Monthly income</span><BadgeCheck className="h-4 w-4 text-mint" /></div><div className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">₹15–20k</div><div className="mt-1 text-[10px] text-ink/40">Derived band · 6 months</div></div><div className="rounded-2xl border border-ink/8 p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/35">Work history</span><BadgeCheck className="h-4 w-4 text-mint" /></div><div className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">8 months</div><div className="mt-1 text-[10px] text-ink/40">Consistency · 86%</div></div></div><div className="flex items-center gap-2 border-t border-ink/8 pt-4 text-[10px] text-ink/35"><LockKeyhole className="h-3.5 w-3.5 text-mint" /> Hidden: customer names · raw payments · job list</div></> : <button type="button" onClick={() => runVerify(false)} className="text-[11px] font-bold text-ink underline decoration-ink/20 underline-offset-4">Restore original credential</button>}</div>}<div className="mt-6 border-t border-ink/8 pt-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[11px] font-bold text-ink/60"><CircleAlert className="h-4 w-4 text-saffron" /> Tamper test</div><button type="button" onClick={() => runVerify(true)} disabled={loading} className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-[10px] font-bold text-ink/55 transition hover:border-ink/20 hover:text-ink">{loading ? "Checking…" : "Edit a claim"}</button></div><p className="mt-2 text-[10px] leading-5 text-ink/35">Try changing ₹15–20k to ₹25–30k. The signature will no longer match.</p></div></div></div></div>;
}

function ReviewView() {
  const fraudQuery = trpc.workpass.getFraudFlags.useQuery();
  const [expanded, setExpanded] = useState(false);
  const flag = fraudQuery.data?.[0];
  return <div className="space-y-8 pb-10"><SectionTitle eyebrow="Human-in-the-loop review" title="Signals, not verdicts." description="Suspicious patterns go to review with a reason the worker can understand and contest." action={<StatusPill tone="amber" icon={CircleAlert}>1 needs review</StatusPill>} /><div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"><div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)] sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Flagged pattern</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">Possible confirmation ring</h3></div><div className="rounded-2xl bg-amber-50 p-3 text-amber-700"><Network className="h-5 w-5" /></div></div><div className="mt-6 rounded-2xl bg-[#f8f6f1] p-5"><div className="relative mx-auto h-44 max-w-[360px]"><div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 -rotate-[18deg] bg-saffron/45" /><div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 rotate-[22deg] bg-saffron/45" /><div className="absolute left-1/2 top-1/2 h-px w-44 -translate-x-1/2 rotate-90 bg-saffron/45" /><div className="absolute left-[calc(50%-28px)] top-[calc(50%-28px)] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-white shadow-lg">Lakshmi</div><div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-saffron text-[9px] font-bold text-ink shadow">C-01</div><div className="absolute right-5 top-7 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-mint text-[9px] font-bold text-white shadow">C-02</div><div className="absolute bottom-4 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-rose-400 text-[9px] font-bold text-white shadow">C-03</div></div><div className="mt-2 text-center text-[10px] font-semibold text-ink/40">3 new accounts · 11 confirmations · 14 days</div></div><div className="mt-5 space-y-3"><div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-amber-50 p-1.5 text-amber-700"><CircleAlert className="h-3.5 w-3.5" /></div><div><div className="text-[11px] font-bold text-ink">Why this was flagged</div><div className="mt-1 text-[11px] leading-5 text-ink/45">{flag?.reason ?? "Three customer accounts were created recently and only confirm this worker."}</div></div></div><div className="flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-mint/10 p-1.5 text-mint"><ShieldCheck className="h-3.5 w-3.5" /></div><div><div className="text-[11px] font-bold text-ink">What happens next</div><div className="mt-1 text-[11px] leading-5 text-ink/45">The work stays in the passport as needs review. Lakshmi can add payment proof or another customer confirmation.</div></div></div></div><button type="button" onClick={() => setExpanded(!expanded)} className="mt-6 flex items-center gap-2 text-[11px] font-bold text-ink/55 underline decoration-ink/15 underline-offset-4">{expanded ? "Hide review notes" : "View review notes"}<ChevronRight className={cn("h-3.5 w-3.5 transition", expanded && "rotate-90")} /></button>{expanded ? <div className="mt-3 rounded-xl bg-ink/[0.035] p-3 text-[10px] leading-5 text-ink/45">No protected attributes are used in this signal. Income seasonality is not scored as suspicious. This review can be appealed by the worker.</div> : null}</div><div className="space-y-4"><div className="rounded-[26px] bg-ink p-6 text-white shadow-[0_14px_30px_rgba(24,32,53,0.12)]"><div className="flex items-center gap-2 text-saffron"><Sparkles className="h-4 w-4" /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Fairness promise</span></div><h3 className="mt-5 max-w-xs font-display text-2xl font-semibold leading-tight tracking-[-0.045em]">A flag is a question, not a rejection.</h3><p className="mt-3 max-w-sm text-sm leading-6 text-white/55">Every decision comes with a reason, an appeal path, and a human review option.</p><div className="mt-6 grid grid-cols-2 gap-2"><div className="rounded-2xl bg-white/8 p-3"><div className="font-display text-xl font-semibold">0</div><div className="mt-1 text-[10px] text-white/40">auto-rejections</div></div><div className="rounded-2xl bg-white/8 p-3"><div className="font-display text-xl font-semibold">100%</div><div className="mt-1 text-[10px] text-white/40">reason shown</div></div></div></div><div className="rounded-[26px] border border-ink/10 bg-white p-6 shadow-[0_8px_20px_rgba(24,32,53,0.035)]"><div className="flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.17em] text-saffron">Review queue</p><h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.035em] text-ink">1 open signal</h3></div><button type="button" onClick={() => toast.success("Queue refreshed", { description: "No new signals found." })} className="rounded-xl border border-ink/10 p-2 text-ink/45 transition hover:border-ink/20 hover:text-ink"><RefreshCw className="h-4 w-4" /></button></div><div className="mt-5 flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/45 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Network className="h-4 w-4" /></div><div className="flex-1"><div className="text-[11px] font-bold text-ink">Confirmation ring</div><div className="mt-1 text-[10px] text-ink/40">Lakshmi S. · low severity</div></div><ChevronRight className="h-4 w-4 text-ink/25" /></div><button type="button" onClick={() => toast("Review workflow", { description: "Appeal and evidence collection controls are ready for the next sprint." })} className="mt-4 w-full rounded-xl border border-ink/10 px-4 py-3 text-[11px] font-bold text-ink/60 transition hover:border-ink/20 hover:text-ink">Open case details</button></div></div></div></div>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("worker");
  const setView = (view: View) => { setActiveView(view); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <div className="min-h-screen bg-[#f8f6f1] text-ink"><div className="flex min-h-screen flex-col lg:flex-row"><Sidebar activeView={activeView} onSelect={setView} /><main className="min-w-0 flex-1 bg-[#fcfbf8]"><TopBar activeView={activeView} /><div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">{activeView === "worker" ? <WorkerView onGoToCustomer={() => setView("customer")} onGoToVerifier={() => setView("verifier")} /> : activeView === "customer" ? <CustomerView /> : activeView === "verifier" ? <VerifierView /> : <ReviewView />}</div></main></div></div>;
}

const _unused = [BarChart3, Clock3, Globe2, History, Pause, Play, Star, Upload, HelpCircle];
void _unused;
void useMemo;
