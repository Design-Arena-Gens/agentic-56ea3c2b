import { BadgeCheck, Bell, Crown, Sparkles } from "lucide-react";
import Image from "next/image";

export function DashboardHeader() {
  return (
    <header className="flex items-start justify-between gap-6 rounded-3xl border border-white/5 bg-white/5 bg-gradient-to-tr from-white/10 via-white/0 to-white/10 p-8 text-white shadow-2xl shadow-black/30">
      <div className="flex items-start gap-4">
        <div className="relative">
          <Image
            src="https://i.pravatar.cc/300?img=47"
            alt="Profile avatar"
            width={64}
            height={64}
            className="h-16 w-16 rounded-2xl border border-white/20 object-cover"
          />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-black">
            4K
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Hey, Nova!</h1>
            <BadgeCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-1 text-sm text-white/60">
            Your AI studio processed 14.2 hours of video this week. Keep the
            brilliance flowing.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Auto UHD Enhancer Active
            </span>
            <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
              Queue capacity: 8 / 12
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-4 text-sm text-white/60">
        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-2 transition hover:border-emerald-400/50 hover:text-white">
          <Crown className="h-4 w-4 text-amber-300" />
          Visionary Pro · Monthly
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/30 transition hover:border-white/30 hover:text-white">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
