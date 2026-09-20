import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function AppMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-ink text-white shadow-[0_8px_20px_rgba(24,32,53,0.18)]">
      <div className="absolute left-[11px] top-[10px] h-[20px] w-[13px] rounded-[6px] border-2 border-saffron" />
      <div className="absolute bottom-[8px] right-[8px] h-2 w-2 rounded-full bg-mint" />
    </div>
  );
}

export function IconButton({ icon: Icon, label, onClick, active = false }: { icon: LucideIcon; label: string; onClick?: () => void; active?: boolean }) {
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

export function StatusPill({ children, tone = "slate", icon: Icon }: { children: React.ReactNode; tone?: "emerald" | "amber" | "slate" | "saffron" | "rose" | "sky"; icon?: LucideIcon }) {
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

export function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
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

export function TrustMeter({ score = 82 }: { score?: number }) {
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
