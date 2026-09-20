import { cn } from "@/lib/utils";
import { ArrowUpRight, Bell, ChevronRight, ClipboardCheck, LockKeyhole, Network, ScanLine, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { AppMark, IconButton } from "./SharedUI";

export type View = "worker" | "customer" | "verifier" | "review";

type NavItem = {
  id: View;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: "worker", label: "John's passport", hint: "Worker view", icon: WalletCards },
  { id: "customer", label: "Confirm a job", hint: "Customer view", icon: ClipboardCheck },
  { id: "verifier", label: "Verify a claim", hint: "Lender view", icon: ScanLine },
  { id: "review", label: "Review signals", hint: "NGO / admin", icon: Network },
];

export function Sidebar({ activeView, onSelect }: { activeView: View; onSelect: (view: View) => void }) {
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

export function TopBar({ activeView }: { activeView: View }) {
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
