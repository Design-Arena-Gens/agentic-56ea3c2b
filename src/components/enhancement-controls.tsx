import type { ReactNode } from "react";
import { Dispatch, SetStateAction } from "react";
import {
  Aperture,
  Braces,
  Contrast,
  Film,
  Rainbow,
  Sparkle,
} from "lucide-react";

export type EnhancementSettings = {
  noiseReduction: number;
  colorCorrection: number;
  frameRate: "24" | "30" | "48" | "60";
  detailEnhancement: number;
  hdrToneMap: "Cinematic HDR" | "HLG" | "Dolby Vision";
  facePriority: boolean;
  batchMode: boolean;
  exportFormat: "mp4" | "mov" | "mkv";
};

type Props = {
  settings: EnhancementSettings;
  setSettings: Dispatch<SetStateAction<EnhancementSettings>>;
};

export function EnhancementControls({ settings, setSettings }: Props) {
  return (
    <section className="rounded-3xl border border-white/5 bg-black/30 p-6 text-white shadow-lg shadow-black/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            AI Enhancement Controls
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Tweak precision settings for your UHD mastering pipeline.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
          <Sparkle className="h-3.5 w-3.5" />
          Pro+
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ControlCard
          icon={<Film className="h-5 w-5 text-emerald-300" />}
          title="Noise Reduction"
          description="Smartly suppress dynamic noise while preserving cinematic grain."
        >
          <RangeInput
            value={settings.noiseReduction}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, noiseReduction: value }))
            }
          />
        </ControlCard>

        <ControlCard
          icon={<Contrast className="h-5 w-5 text-emerald-300" />}
          title="Color Correction"
          description="Adaptive color balance with Rec.2020 gamut awareness."
        >
          <RangeInput
            value={settings.colorCorrection}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, colorCorrection: value }))
            }
          />
        </ControlCard>

        <ControlCard
          icon={<Aperture className="h-5 w-5 text-emerald-300" />}
          title="Frame Rate Upscale"
          description="Re-timestretch to ultra-fluid 60fps with motion-compensated AI."
        >
          <select
            value={settings.frameRate}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                frameRate: event.target.value as EnhancementSettings["frameRate"],
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-300/20"
          >
            <option value="24" className="bg-zinc-900 text-white">
              24 fps (Film)
            </option>
            <option value="30" className="bg-zinc-900 text-white">
              30 fps
            </option>
            <option value="48" className="bg-zinc-900 text-white">
              48 fps (HFR)
            </option>
            <option value="60" className="bg-zinc-900 text-white">
              60 fps Ultra Smooth
            </option>
          </select>
        </ControlCard>

        <ControlCard
          icon={<Braces className="h-5 w-5 text-emerald-300" />}
          title="Detail Enhancement"
          description="Rebuild micro-contrast for faces, fabrics, and environment props."
        >
          <RangeInput
            value={settings.detailEnhancement}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, detailEnhancement: value }))
            }
          />
        </ControlCard>

        <ControlCard
          icon={<Rainbow className="h-5 w-5 text-emerald-300" />}
          title="HDR Tone Mapping"
          description="Select the mastering target for high dynamic range delivery."
        >
          <div className="flex flex-wrap gap-2">
            {(["Cinematic HDR", "HLG", "Dolby Vision"] as const).map((mode) => (
              <button
                key={mode}
                className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                  settings.hdrToneMap === mode
                    ? "border-emerald-400/60 bg-emerald-500/20 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                }`}
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    hdrToneMap: mode,
                  }))
                }
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>
        </ControlCard>

        <ControlCard
          icon={<Sparkle className="h-5 w-5 text-emerald-300" />}
          title="Pro Focus"
          description="Prioritize facial fidelity and depth extraction in busy frames."
        >
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-white/70">Face & object focus</span>
              <Toggle
                checked={settings.facePriority}
                onChange={(checked) =>
                  setSettings((prev) => ({ ...prev, facePriority: checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-white/70">Parallel batch queue</span>
              <Toggle
                checked={settings.batchMode}
                onChange={(checked) =>
                  setSettings((prev) => ({ ...prev, batchMode: checked }))
                }
              />
            </label>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">
                Export format
              </p>
              <div className="mt-2 flex gap-2">
                {(["mp4", "mov", "mkv"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    className={`rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                      settings.exportFormat === format
                        ? "border-emerald-400/60 bg-emerald-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        exportFormat: format,
                      }))
                    }
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ControlCard>
      </div>
    </section>
  );
}

type ControlCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

function ControlCard({ icon, title, description, children }: ControlCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.04] p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/40">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-white/60">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

type RangeInputProps = {
  value: number;
  onChange: (value: number) => void;
};

function RangeInput({ value, onChange }: RangeInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
        <span>Intensity</span>
        <span className="text-emerald-300">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-input h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10"
      />
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full border transition ${
        checked
          ? "border-emerald-300 bg-emerald-400/60"
          : "border-white/20 bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
