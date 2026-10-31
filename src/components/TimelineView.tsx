"use client";

import React, { useState, useRef } from "react";
import { CinematicTimeline, VideoClipItem, AudioClipItem, TimelineTrackAudio } from "@/lib/editing/types";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sliders,
  Layers,
  Video,
  Music,
  Sparkles,
  Scissors,
  Maximize2,
  RotateCcw,
} from "lucide-react";

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
  const [mutedTracks, setMutedTracks] = useState<Record<string, boolean>>({});
  const [soloTracks, setSoloTracks] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const selectedClip = timeline.videoTrack.clips.find((c) => c.id === selectedClipId);
  const totalDuration = timeline.totalDuration || 48;

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(totalDuration, time));
    setCurrentTime(videoRef.current.currentTime);
  };

  const toggleTrackMute = (trackId: string) => {
    setMutedTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const toggleTrackSolo = (trackId: string) => {
    setSoloTracks((prev) => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  const formatTimecode = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${ms}`;
  };

  const playheadPercent = Math.min(100, (currentTime / totalDuration) * 100);

  return (
    <div className="space-y-6">
      {/* Top Section: Video Preview Player + Clip Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Player Container (9:16 vertical view box) */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-4 border border-obsidian-700 flex flex-col items-center justify-between min-h-[520px]">
          <div className="w-full flex items-center justify-between border-b border-obsidian-750 pb-2 mb-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-obsidian-800 text-gold-400 border border-gold-500/30">
              Preview Player ({timeline.targetWidth}x{timeline.targetHeight})
            </span>
            <span className="text-[11px] font-mono text-platinum-400">
              {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
            </span>
          </div>

          <div className="relative aspect-[9/16] h-[380px] sm:h-[420px] bg-black rounded-lg overflow-hidden border border-obsidian-700 shadow-2xl flex items-center justify-center my-auto">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
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
                    Click &quot;Render Video (FFmpeg)&quot; below to compile and play the cinematic edit.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Player Transport Controls */}
          <div className="w-full bg-obsidian-900/90 rounded-lg p-2.5 border border-obsidian-750 flex items-center justify-between mt-2">
            <button
              onClick={() => handleSeek(0)}
              className="p-1.5 rounded hover:bg-obsidian-800 text-platinum-400 hover:text-platinum-200 transition-colors"
              title="Jump to Start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={!videoUrl}
              className="px-4 py-1.5 rounded-md bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all disabled:opacity-40"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-obsidian-950" /> : <Play className="w-4 h-4 fill-obsidian-950" />}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={() => {
                if (videoRef.current && videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }}
              disabled={!videoUrl}
              className="p-1.5 rounded hover:bg-obsidian-800 text-platinum-400 hover:text-platinum-200 transition-colors disabled:opacity-40"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
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
                    <span className="text-platinum-200 font-semibold">{selectedClip.duration}s</span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Color Grade Preset</span>
                    <span className="text-gold-400 font-semibold">{selectedClip.colorPresetName}</span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Transition In</span>
                    <span className="text-platinum-200 font-semibold">
                      {selectedClip.transitionIn.type} ({selectedClip.transitionIn.duration}s)
                    </span>
                  </div>
                  <div className="bg-obsidian-900 p-2.5 rounded border border-obsidian-750">
                    <span className="text-platinum-500 font-mono block mb-0.5">Smart Crop Transform</span>
                    <span className="text-platinum-200 font-semibold">
                      {selectedClip.sourceUrl === "black" ? "Native Black Slug" : "1080x1920 (Center Subject Safe)"}
                    </span>
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
        <div className="relative space-y-4 bg-obsidian-950 p-4 rounded-lg border border-obsidian-800 overflow-x-auto">
          {/* Scrubbable Time Ruler */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              handleSeek(ratio * totalDuration);
            }}
            className="relative h-6 bg-obsidian-900 rounded cursor-pointer border-b border-obsidian-750 flex items-center justify-between text-[10px] text-platinum-500 font-mono px-2 select-none"
          >
            <span>0.0s</span>
            <span>{(totalDuration * 0.25).toFixed(1)}s</span>
            <span>{(totalDuration * 0.5).toFixed(1)}s</span>
            <span>{(totalDuration * 0.75).toFixed(1)}s</span>
            <span>{totalDuration.toFixed(1)}s</span>

            {/* Playhead Indicator Line */}
            <div
              style={{ left: `${playheadPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-gold-400 pointer-events-none z-20 shadow-[0_0_8px_rgba(197,160,89,0.8)]"
            >
              <div className="w-2.5 h-2.5 bg-gold-400 rotate-45 -translate-x-[4px] -translate-y-1" />
            </div>
          </div>

          {/* V1 — Primary Video Track */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-platinum-400">
              <div className="flex items-center space-x-2">
                <Video className="w-3.5 h-3.5 text-gold-400" />
                <span>V1 — Primary Video Track</span>
              </div>
              <span className="text-[10px] text-platinum-500">{timeline.videoTrack.clips.length} Clips</span>
            </div>

            <div className="relative h-16 bg-obsidian-900 rounded border border-obsidian-750 flex overflow-hidden">
              {timeline.videoTrack.clips.map((clip: VideoClipItem) => {
                const widthPct = (clip.duration / totalDuration) * 100;
                const isSelected = clip.id === selectedClipId;

                return (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setSelectedClipId(clip.id);
                      handleSeek(clip.timelineStart);
                    }}
                    style={{ width: `${widthPct}%` }}
                    className={`h-full border-r border-obsidian-950 p-2 cursor-pointer transition-all flex flex-col justify-between shrink-0 relative ${
                      isSelected
                        ? "bg-gold-500/25 border-2 border-gold-400 shadow-lg shadow-gold-500/20"
                        : "bg-obsidian-800 hover:bg-obsidian-750"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-platinum-100 font-mono truncate">{clip.sceneId}</span>
                      <span className="text-[9px] text-gold-400 font-mono">{clip.duration}s</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-platinum-400">
                      <span className="truncate">{clip.colorPresetName}</span>
                      {clip.transitionIn.type !== "none" && (
                        <span className="text-[8px] bg-obsidian-900/90 text-gold-400 px-1 rounded border border-gold-500/20">
                          {clip.transitionIn.type.slice(0, 4)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio Tracks (A1 Environment, A2 Secondary, A3 Voiceover, A4 Music) */}
          {timeline.audioTracks.map((track: TimelineTrackAudio) => {
            const isMuted = !!mutedTracks[track.id];
            const isSolo = !!soloTracks[track.id];

            return (
              <div key={track.id} className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono text-platinum-400">
                  <div className="flex items-center space-x-2">
                    <Music className="w-3.5 h-3.5 text-blue-400" />
                    <span>{track.name}</span>
                  </div>

                  {/* Track Controls: Mute & Solo */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleTrackMute(track.id)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                        isMuted
                          ? "bg-red-500/20 text-red-400 border-red-500/40"
                          : "bg-obsidian-850 text-platinum-400 border-obsidian-700 hover:text-platinum-200"
                      }`}
                    >
                      M
                    </button>
                    <button
                      onClick={() => toggleTrackSolo(track.id)}
                      className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors ${
                        isSolo
                          ? "bg-gold-500/20 text-gold-400 border-gold-500/40"
                          : "bg-obsidian-850 text-platinum-400 border-obsidian-700 hover:text-platinum-200"
                      }`}
                    >
                      S
                    </button>
                    <span className="text-[10px] text-platinum-500">{(track.gain * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="relative h-11 bg-obsidian-900 rounded border border-obsidian-750 flex overflow-hidden">
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
                          className={`h-full border rounded p-1.5 flex items-center justify-between text-[10px] font-mono shrink-0 transition-opacity ${
                            isMuted
                              ? "opacity-30 bg-gray-900 border-gray-700 text-gray-500"
                              : "bg-blue-950/60 border-blue-500/30 text-blue-300"
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className="truncate">{clip.sceneId || "Audio Track"}</span>
                            {clip.fadeInDuration > 0.5 && (
                              <span className="text-[8px] bg-blue-900/60 text-blue-300 px-1 rounded">J</span>
                            )}
                            {clip.fadeOutDuration > 0.5 && (
                              <span className="text-[8px] bg-blue-900/60 text-blue-300 px-1 rounded">L</span>
                            )}
                          </div>
                          <span>{clip.duration.toFixed(1)}s</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-platinum-600 font-mono">
                      Track Standby (Future Stems)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
