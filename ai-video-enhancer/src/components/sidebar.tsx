import { Clapperboard, Gauge, History, Settings, Sparkles, Upload } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Enhance", icon: Sparkles },
  { label: "Uploads", icon: Upload },
  { label: "Performance", icon: Gauge },
  { label: "History", icon: History },
  { label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-black/40 px-6 py-6 backdrop-blur">
      <div className="mb-8 flex items-center gap-3 text-white">
        <Clapperboard className="h-7 w-7 text-emerald-400" />
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-white/70">
            Elevate AI Studio
          </p>
          <p className="text-lg font-semibold tracking-tight text-white">
            VisionForge
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, icon: Icon }) => (
          <Link
            key={label}
            href="#"
            className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white ${
              label === "Enhance" ? "bg-white/10 text-white" : ""
            }`}
          >
            <Icon className="h-5 w-5 text-white/60 group-hover:text-emerald-400" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-4 text-white/80">
        <p className="text-sm font-semibold text-white">Pro Level</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Unlock unlimited UHD exports, real-time AI upscaling, and team
          collaboration.
        </p>
        <button className="mt-4 w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400">
          Upgrade Plan
        </button>
      </div>
    </aside>
  );
}
