"use client";

import React, { useState } from "react";
import { CinematicTimeline, VideoClipItem, AudioClipItem } from "@/lib/editing/types";
import { Play, Pause, Volume2, Sliders, Layers, Video, Music, Sparkles } from "lucide-react";

interface TimelineViewProps {
  timeline: CinematicTimeline;
  videoUrl?: string;
  onRenderRequest?: () => void;
  isRendering?: boolean;
}

export function TimelineView({ timeline, videoUrl, onRenderRequest, isRendering }: TimelineViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(timeline.videoTrack.clips[0]?.id || null);
  const [currentTime, setCurrentTime] = useState(0);

  const selectedClip = timeline.videoTrack.clips.find((c) => c.id === selectedClipId);

  const totalDuration = timeline.totalDuration || 30;

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Video Preview Player + Clip Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Player Container (9:16 vertical view box) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 border border-obsidian-700 flex flex-col items-center justify-center min-h-[480px]">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-obsidian-800 text-gold-400 border border-gold-500/30 mb-3">
            Realtime Preview Player ({timeline.targetWidth}x{timeline.targetHeight})
          </span>

          <div className="relative aspect-[9/16] h-[380px] sm:h-[440px] bg-black rounded-lg overflow-hidden border border-obsidian-700 shadow-2xl flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto animate-pulse">
                  <Play className="w-6 h-6 fill-gold-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-platinum-200">Video Render Required</h4>
                  <p className="text-xs text-platinum-500 mt-1">
                    Click &quot;Render Video (FFmpeg)&quot; below to generate the playable MP4 file.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Clip Inspector & Color Grade Panel */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-obsidian-700 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-gold-400" />
                <h3 className="font-semibold text-sm text-platinum-100 uppercase font-mono">
                  Clip & Grading Inspector
                </h3>
              </div>
              {selectedClip && (
                <span className="text-xs text-gold-400 font-mono bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">
                  {selectedClip.sceneId}
                </span>
              )}
            </div>

            {selectedClip ? (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Duration</span>
                    <span className="text-platinum-200 font-semibold">{selectedClip.duration} seconds</span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Color Grade Preset</span>
                    <span className="text-gold-400 font-semibold">{selectedClip.colorPresetName}</span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Transition In</span>
                    <span className="text-platinum-200 font-semibold">{selectedClip.transitionIn.type} ({selectedClip.transitionIn.duration}s)</span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Smart Crop Transform</span>
                    <span className="text-platinum-200 font-semibold">1080x1920 (Center Subject Safe)</span>
                  </div>
                </div>

                {/* Color Matrix */}
                <div className="bg-obsidian-900/80 p-3.5 rounded-lg border border-obsidian-750 space-y-2 text-xs">
                  <span className="text-gold-400 font-mono font-semibold uppercase block">Color Grade Parameters</span>
                  <div className="grid grid-cols-3 gap-2 text-platinum-300 font-mono">
                    <div>Contrast: {selectedClip.color.contrast ?? 1.0}</div>
                    <div>Exposure: {selectedClip.color.exposure ?? 0}</div>
                    <div>Saturation: {selectedClip.color.saturation ?? 1.0}</div>
                    <div>Temp Shift: {selectedClip.color.temperature ?? 0}</div>
                    <div>Vignette: {selectedClip.color.vignette ?? 0}</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-platinum-500 py-8 text-center">
                Select any clip on the timeline below to inspect and fine-tune properties.
              </p>
            )}
          </div>

          {/* Render Action Bar */}
          <div className="bg-obsidian-850 p-4 rounded-xl border border-obsidian-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-platinum-200 block">FFmpeg Modular Render Engine</span>
              <p className="text-[11px] text-platinum-400">Compiles high-bitrate MP4 with color grading & J/L-cuts</p>
            </div>

            <button
              onClick={onRenderRequest}
              disabled={isRendering}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-md shadow-gold-500/10 disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <div className="w-4 h-4 border-2 border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                  <span>Rendering MP4...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Render Video (FFmpeg)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Track Cinematic NLE Timeline Container */}
      <div className="glass-panel rounded-xl p-5 border border-obsidian-700 space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-gold-400" />
            <h3 className="font-semibold text-sm text-platinum-100 uppercase font-mono">
              Multi-Track Timeline Visualization
            </h3>
          </div>
          <span className="text-xs text-platinum-400 font-mono">Total Duration: {totalDuration.toFixed(1)}s</span>
        </div>

        {/* Timeline Tracks Area */}
        <div className="space-y-3 bg-obsidian-950 p-4 rounded-lg border border-obsidian-800 overflow-x-auto">
          {/* Time Ruler */}
          <div className="flex justify-between text-[10px] text-platinum-500 font-mono pb-2 border-b border-obsidian-800">
            <span>0.0s</span>
            <span>{(totalDuration * 0.25).toFixed(1)}s</span>
            <span>{(totalDuration * 0.5).toFixed(1)}s</span>
            <span>{(totalDuration * 0.75).toFixed(1)}s</span>
            <span>{totalDuration.toFixed(1)}s</span>
          </div>

          {/* V1 — Primary Video Track */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-mono text-platinum-400">
              <Video className="w-3.5 h-3.5 text-gold-400" />
              <span>V1 — Primary Video Track</span>
            </div>

            <div className="relative h-14 bg-obsidian-900 rounded border border-obsidian-750 flex overflow-hidden">
              {timeline.videoTrack.clips.map((clip: VideoClipItem) => {
                const widthPct = (clip.duration / totalDuration) * 100;
                const isSelected = clip.id === selectedClipId;

                return (
                  <div
                    key={clip.id}
                    onClick={() => setSelectedClipId(clip.id)}
                    style={{ width: `${widthPct}%` }}
                    className={`h-full border-r border-obsidian-950 p-2 cursor-pointer transition-all flex flex-col justify-between shrink-0 ${
                      isSelected
                        ? "bg-gold-500/20 border-2 border-gold-400 shadow-lg shadow-gold-500/20"
                        : "bg-obsidian-800 hover:bg-obsidian-750"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-platinum-100 font-mono truncate">{clip.sceneId}</span>
                      <span className="text-[9px] text-gold-400 font-mono">{clip.duration}s</span>
                    </div>
                    <span className="text-[9px] text-platinum-400 truncate">{clip.colorPresetName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* A1 — Environment Audio Track (with J/L cuts) */}
          {timeline.audioTracks.map((track) => (
            <div key={track.id} className="space-y-1.5 pt-1">
              <div className="flex items-center space-x-2 text-xs font-mono text-platinum-400">
                <Music className="w-3.5 h-3.5 text-blue-400" />
                <span>{track.name}</span>
              </div>

              <div className="relative h-10 bg-obsidian-900 rounded border border-obsidian-750 flex overflow-hidden">
                {track.clips.length > 0 ? (
                  track.clips.map((clip: AudioClipItem) => {
                    const widthPct = (clip.duration / totalDuration) * 100;
                    const leftPct = (clip.timelineStart / totalDuration) * 100;

                    return (
                      <div
                        key={clip.id}
                        style={{
                          width: `${widthPct}%`,
                          marginLeft: `${leftPct}%`,
                        }}
                        className="h-full bg-blue-950/60 border border-blue-500/30 rounded p-1.5 flex items-center justify-between text-[10px] text-blue-300 font-mono shrink-0"
                      >
                        <span className="truncate">{clip.sceneId || "Audio Track"}</span>
                        <span>{clip.duration.toFixed(1)}s</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-platinum-600 font-mono">
                    Track Reserved
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
