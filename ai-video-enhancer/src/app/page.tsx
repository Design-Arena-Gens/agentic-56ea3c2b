"use client";

import type { DragEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EnhancementControls, EnhancementSettings } from "../components/enhancement-controls";
import { HistoryList, EnhancedRecord } from "../components/history-list";
import { DashboardHeader } from "../components/dashboard-header";
import { Sidebar } from "../components/sidebar";
import { VideoPreview } from "../components/video-preview";
import { Clock, Loader2, UploadCloud, X } from "lucide-react";

const defaultSettings: EnhancementSettings = {
  noiseReduction: 72,
  colorCorrection: 68,
  frameRate: "60",
  detailEnhancement: 64,
  hdrToneMap: "Cinematic HDR",
  facePriority: true,
  batchMode: true,
  exportFormat: "mp4",
};

const presetHistory: EnhancedRecord[] = [
  {
    id: "hx-192",
    fileName: "fashion_campaign_cut.mp4",
    duration: "03:12",
    status: "Completed",
    frameRate: "60 fps",
    exportFormat: "mov",
    createdAt: "Today · 09:24",
    features: ["4K Upscale", "Skin Tone Rebalance", "HDR10"],
  },
  {
    id: "hx-193",
    fileName: "travel_sizzle_master.mov",
    duration: "01:44",
    status: "Completed",
    frameRate: "48 fps",
    exportFormat: "mp4",
    createdAt: "Yesterday · 19:08",
    features: ["HDR Dolby Vision", "Noise Lift", "Face Priority"],
  },
  {
    id: "hx-194",
    fileName: "concert_after_movie.mkv",
    duration: "07:28",
    status: "Completed",
    frameRate: "60 fps",
    exportFormat: "mkv",
    createdAt: "Yesterday · 08:55",
    features: ["Dynamic Tone Map", "60fps", "Batch Export"],
  },
];

export default function Home() {
  const [settings, setSettings] = useState<EnhancementSettings>(defaultSettings);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [history, setHistory] = useState<EnhancedRecord[]>(presetHistory);
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewSource) {
        URL.revokeObjectURL(previewSource);
      }
    };
  }, [previewSource]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const selected = Array.from(files);
      setQueuedFiles((prev) => {
        const merged = settings.batchMode ? [...prev, ...selected] : [selected[0]];
        const uniqueByKey = new Map<string, File>();
        merged.forEach((file) => uniqueByKey.set(`${file.name}-${file.size}`, file));
        const final = Array.from(uniqueByKey.values()).slice(0, 12);
        if (final.length > 0) {
          const [first] = final;
          const nextPreview = URL.createObjectURL(first);
          setPreviewSource((previous) => {
            if (previous) URL.revokeObjectURL(previous);
            return nextPreview;
          });
        }
        return final;
      });
    },
    [settings.batchMode],
  );

  const removeFromQueue = useCallback((file: File) => {
    setQueuedFiles((prev) => {
      const next = prev.filter((item) => item !== file);
      if (next.length === 0) {
        setPreviewSource((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return null;
        });
      } else {
        const [first] = next;
        const nextPreview = URL.createObjectURL(first);
        setPreviewSource((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return nextPreview;
        });
      }
      return next;
    });
  }, []);

  const handleEnhancement = useCallback(async () => {
    if (queuedFiles.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setProgress(8);

    const filesToProcess = [...queuedFiles];
    const segment = 100 / filesToProcess.length;
    const featureSummary = buildFeatureSummary(settings);

    for (let index = 0; index < filesToProcess.length; index += 1) {
      const file = filesToProcess[index];
      await new Promise<void>((resolve) => {
        let localProgress = 0;
        const tick = () => {
          localProgress += Math.random() * 18 + 6;
          const computed = Math.min(
            100,
            index * segment + (Math.min(localProgress, 100) / 100) * segment,
          );
          setProgress(computed);
          if (localProgress >= 100) {
            const completionStamp = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date());
            setHistory((prev) => [
              {
                id: `${Date.now()}-${index}`,
                fileName: file.name,
                duration: createDurationLabel(file.size),
                status: "Completed",
                frameRate: `${settings.frameRate} fps`,
                exportFormat: settings.exportFormat,
                createdAt: `Today · ${completionStamp}`,
                features: featureSummary,
              },
              ...prev,
            ]);
            resolve();
          } else {
            setTimeout(tick, 220 + Math.random() * 120);
          }
        };
        setTimeout(tick, 240);
      });
    }

    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setQueuedFiles([]);
      setPreviewSource((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    }, 420);
  }, [queuedFiles, isProcessing, settings]);

  const activeMode = useMemo(() => {
    return `${settings.frameRate}fps · ${settings.hdrToneMap}`;
  }, [settings.frameRate, settings.hdrToneMap]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-black/60 text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white/5 via-transparent to-emerald-500/10 px-8 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <DashboardHeader />

          <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
            <section className="space-y-6">
              <UploadPanel
                files={queuedFiles}
                onFilesSelected={handleFiles}
                onRemove={removeFromQueue}
                onEnhance={handleEnhancement}
                isProcessing={isProcessing}
                progress={progress}
                targetFrameRate={settings.frameRate}
                exportFormat={settings.exportFormat}
              />
              <VideoPreview
                source={previewSource}
                enhancedSource={previewSource}
                isProcessing={isProcessing}
                progress={progress}
                activeMode={activeMode}
              />
            </section>
            <EnhancementControls settings={settings} setSettings={setSettings} />
          </div>

          <HistoryList items={history} />
        </div>
      </main>
    </div>
  );
}

type UploadPanelProps = {
  files: File[];
  onFilesSelected: (files: FileList | null) => void;
  onRemove: (file: File) => void;
  onEnhance: () => void;
  isProcessing: boolean;
  progress: number;
  targetFrameRate: EnhancementSettings["frameRate"];
  exportFormat: EnhancementSettings["exportFormat"];
};

function UploadPanel({
  files,
  onFilesSelected,
  onRemove,
  onEnhance,
  isProcessing,
  progress,
  targetFrameRate,
  exportFormat,
}: UploadPanelProps) {
  const onDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      onFilesSelected(event.dataTransfer.files);
    },
    [onFilesSelected],
  );

  const totalDuration = useMemo(() => {
    if (files.length === 0) return "0";
    const totalBytes = files.reduce((acc, file) => acc + file.size, 0);
    const estimatedMinutes = Math.max(1, Math.round(totalBytes / (1024 * 1024 * 300)));
    return `${estimatedMinutes} min`;
  }, [files]);

  return (
    <section className="rounded-3xl border border-white/5 bg-black/30 p-6 shadow-lg shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Upload & Batch Enhance
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Drop up to 12 clips · AI will upscale to 4K UHD with adaptive color and HDR.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-wider text-white/60">
          <Clock className="h-4 w-4" />
          {isProcessing ? `Rendering · ${Math.round(Math.min(progress, 100))}%` : `Queue time · ${totalDuration}`}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)]">
        <label
          htmlFor="video-upload"
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-emerald-400/40 bg-emerald-500/5 p-10 text-center transition hover:border-emerald-300/80 hover:bg-emerald-500/10"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 shadow-emerald-500/20 shadow-[0_12px_40px]">
            <UploadCloud className="h-7 w-7" />
          </span>
          <div className="space-y-2">
            <p className="text-base font-semibold text-white">
              Drag & drop videos or browse to upload
            </p>
            <p className="text-xs uppercase tracking-[0.36em] text-white/40">
              Supports mp4, mov, mkv · up to 12 files
            </p>
          </div>
          <input
            id="video-upload"
            type="file"
            multiple
            accept="video/mp4,video/mov,video/x-matroska,video/*"
            className="hidden"
            onChange={(event) => onFilesSelected(event.target.files)}
          />
          <button
            type="button"
            className="mt-4 rounded-full border border-white/10 bg-black/40 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white/60 transition group-hover:border-emerald-300/60 group-hover:text-white"
          >
            Browse Files
          </button>
        </label>

        {files.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/50">
              <span>Queued ({files.length})</span>
              <span>
                Total approx size · {formatBytes(files.reduce((acc, file) => acc + file.size, 0))}
              </span>
            </div>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.size}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70"
                >
                  <div className="flex min-w-[200px] flex-col">
                    <span className="font-semibold text-white">{file.name}</span>
                    <span className="text-xs text-white/40">
                      {formatBytes(file.size)} · {estimateFrameRate(targetFrameRate)} target
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-white/50">
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1">
                      {exportFormat.toUpperCase()}
                    </span>
                    <button
                      onClick={() => onRemove(file)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition hover:border-red-500/40 hover:text-red-300"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={onEnhance}
              disabled={isProcessing}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition hover:from-emerald-300 hover:via-emerald-400 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Enhance to 4K
                </>
              )}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

function estimateFrameRate(target: EnhancementSettings["frameRate"]) {
  switch (target) {
    case "60":
      return "Ultra Smooth 60fps";
    case "48":
      return "48fps HFR";
    case "30":
      return "Broadcast 30fps";
    default:
      return "24fps Filmic";
  }
}

function createDurationLabel(size: number) {
  const minutes = Math.max(1, Math.round(size / (1024 * 1024 * 350)));
  const seconds = Math.min(59, Math.max(5, Math.round((size % (1024 * 1024 * 350)) / (1024 * 1024 * 6))));
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function buildFeatureSummary(settings: EnhancementSettings) {
  return [
    `AI NR ${settings.noiseReduction}%`,
    `Color Boost ${settings.colorCorrection}%`,
    settings.facePriority ? "Face Priority" : "Universal Detail",
    settings.hdrToneMap,
    `${settings.frameRate}fps`,
    `Export ${settings.exportFormat.toUpperCase()}`,
  ];
}
