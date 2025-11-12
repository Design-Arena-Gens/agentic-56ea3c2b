import { Play, Sparkles } from "lucide-react";

type Props = {
  source?: string | null;
  enhancedSource?: string | null;
  isProcessing: boolean;
  progress: number;
  activeMode: string;
};

export function VideoPreview({
  source,
  enhancedSource,
  isProcessing,
  progress,
  activeMode,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/40 p-6 text-white shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Side-by-side Preview
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Inspect original vs. AI-enhanced output in real time.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          {activeMode}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <PreviewCard title="Original Source" badge="1080p" src={source} mode="before" />
        <PreviewCard
          title="Enhanced UHD"
          badge="4K UHD"
          src={enhancedSource ?? source}
          mode="after"
          label={activeMode}
        />
      </div>

      <div className="mt-6">
        <ProgressDisplay isProcessing={isProcessing} progress={progress} />
      </div>
    </section>
  );
}

type PreviewProps = {
  title: string;
  badge: string;
  src?: string | null;
  mode: "before" | "after";
  label?: string;
};

function PreviewCard({ title, badge, src, mode, label }: PreviewProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span className="font-semibold uppercase tracking-wide">{title}</span>
        <span className="rounded-full bg-black/40 px-3 py-1 font-semibold text-white/70">
          {badge}
        </span>
      </div>
      <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 shadow-inner shadow-black/40">
        {src ? (
          <video
            src={src}
            controls
            playsInline
            className={`h-full w-full object-cover transition duration-500 ${
              mode === "after"
                ? "contrast-[1.15] brightness-[1.08] saturate-[1.3]"
                : "blur-[0.3px] brightness-[0.92]"
            }`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-white/50">
            <Play className="h-10 w-10 text-white/30" />
            <p className="text-xs uppercase tracking-wide">
              Drop a video to preview
            </p>
          </div>
        )}
      </div>
      {label ? (
        <span className="absolute right-5 top-5 rounded-full border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          {label}
        </span>
      ) : null}
    </div>
  );
}

type ProgressDisplayProps = {
  isProcessing: boolean;
  progress: number;
};

function ProgressDisplay({ isProcessing, progress }: ProgressDisplayProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
        <span>{isProcessing ? "Enhancement In Progress" : "Ready for enhancement"}</span>
        <span className="text-emerald-300">
          {isProcessing ? `${Math.min(progress, 100)}%` : "Idle"}
        </span>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-300 transition-all duration-300"
          style={{ width: `${isProcessing ? Math.min(progress, 100) : 0}%` }}
        />
      </div>
    </div>
  );
}
