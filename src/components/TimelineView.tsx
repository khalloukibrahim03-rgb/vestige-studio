"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CinematicTimeline,
  VideoClipItem,
  AudioClipItem,
  ColorConfig,
  TransitionType,
} from "@/lib/editing/types";
import { COLOR_PRESETS } from "@/lib/editing/color/presets";
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
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Clock,
  Scissors,
  Check,
} from "lucide-react";

interface TimelineViewProps {
  timeline: CinematicTimeline;
  videoUrl?: string;
  onRenderRequest?: () => void;
  isRendering?: boolean;
  onUpdateTimeline?: (updated: CinematicTimeline) => void;
}

export function TimelineView({
  timeline: initialTimeline,
  videoUrl,
  onRenderRequest,
  isRendering,
  onUpdateTimeline,
}: TimelineViewProps) {
  const [timeline, setTimeline] = useState<CinematicTimeline>(initialTimeline);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(
    timeline.videoTrack.clips[0]?.id || null
  );
  const [prevInitialTimeline, setPrevInitialTimeline] = useState(initialTimeline);
  if (initialTimeline !== prevInitialTimeline) {
    setPrevInitialTimeline(initialTimeline);
    setTimeline(initialTimeline);
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);

  const selectedClip = timeline.videoTrack.clips.find((c) => c.id === selectedClipId);
  const totalDuration = timeline.totalDuration || 30;

  // Sync timeline changes
  const updateTimelineData = (updated: CinematicTimeline) => {
    setTimeline(updated);
    if (onUpdateTimeline) {
      onUpdateTimeline(updated);
    }
  };

  // Video playback controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!previewBoxRef.current) return;
    if (!document.fullscreenElement) {
      previewBoxRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Clip Property Editors
  const handleDurationChange = (delta: number) => {
    if (!selectedClip) return;
    const newDuration = Math.max(1, Math.round((selectedClip.duration + delta) * 10) / 10);
    const updatedClips = timeline.videoTrack.clips.map((clip) =>
      clip.id === selectedClip.id ? { ...clip, duration: newDuration } : clip
    );

    // Recalculate timeline starts and total duration
    let curTime = 0;
    const reindexedClips = updatedClips.map((clip) => {
      const c = { ...clip, timelineStart: curTime };
      curTime += clip.duration;
      return c;
    });

    updateTimelineData({
      ...timeline,
      totalDuration: curTime,
      videoTrack: { ...timeline.videoTrack, clips: reindexedClips },
    });
  };

  const handleColorParamChange = (param: keyof ColorConfig, value: number) => {
    if (!selectedClip) return;
    const updatedClips = timeline.videoTrack.clips.map((clip) => {
      if (clip.id === selectedClip.id) {
        return {
          ...clip,
          color: {
            ...clip.color,
            [param]: value,
          },
        };
      }
      return clip;
    });

    updateTimelineData({
      ...timeline,
      videoTrack: { ...timeline.videoTrack, clips: updatedClips },
    });
  };

  const handlePresetSelect = (presetName: string) => {
    if (!selectedClip) return;
    const preset = COLOR_PRESETS[presetName] || COLOR_PRESETS["Natural Documentary"];
    const updatedClips = timeline.videoTrack.clips.map((clip) => {
      if (clip.id === selectedClip.id) {
        return {
          ...clip,
          colorPresetName: preset.name,
          color: { ...preset.config },
        };
      }
      return clip;
    });

    updateTimelineData({
      ...timeline,
      videoTrack: { ...timeline.videoTrack, clips: updatedClips },
    });
  };

  const handleTransitionChange = (type: TransitionType) => {
    if (!selectedClip) return;
    const updatedClips = timeline.videoTrack.clips.map((clip) => {
      if (clip.id === selectedClip.id) {
        return {
          ...clip,
          transitionIn: {
            ...clip.transitionIn,
            type,
            duration: type === "none" ? 0 : clip.transitionIn.duration || 0.5,
          },
        };
      }
      return clip;
    });

    updateTimelineData({
      ...timeline,
      videoTrack: { ...timeline.videoTrack, clips: updatedClips },
    });
  };

  const handleMoveClip = (direction: "left" | "right") => {
    if (!selectedClip) return;
    const clips = [...timeline.videoTrack.clips];
    const currentIndex = clips.findIndex((c) => c.id === selectedClip.id);
    if (currentIndex < 0) return;

    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= clips.length) return;

    // Swap clips
    const temp = clips[currentIndex];
    clips[currentIndex] = clips[targetIndex];
    clips[targetIndex] = temp;

    let curTime = 0;
    const reindexedClips = clips.map((clip) => {
      const c = { ...clip, timelineStart: curTime };
      curTime += clip.duration;
      return c;
    });

    updateTimelineData({
      ...timeline,
      totalDuration: curTime,
      videoTrack: { ...timeline.videoTrack, clips: reindexedClips },
    });
  };

  const handleToggleTrackMute = (trackId: string) => {
    const updatedTracks = timeline.audioTracks.map((track) =>
      track.id === trackId ? { ...track, muted: !track.muted } : track
    );
    updateTimelineData({
      ...timeline,
      audioTracks: updatedTracks,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Video Preview Player + Clip Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Player Container (9:16 vertical view box) */}
        <div
          ref={previewBoxRef}
          className="lg:col-span-5 glass-panel rounded-xl p-4 border border-obsidian-700 flex flex-col items-center justify-between min-h-[480px]"
        >
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-obsidian-800 text-gold-400 border border-gold-500/30">
              Realtime Preview ({timeline.targetWidth}x{timeline.targetHeight})
            </span>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-platinum-400">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
              </span>
            </div>
          </div>

          <div className="relative aspect-[9/16] h-[360px] sm:h-[420px] bg-black rounded-lg overflow-hidden border border-obsidian-700 shadow-2xl flex items-center justify-center w-full max-w-[280px]">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
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

          {/* Interactive Player Controls */}
          <div className="w-full mt-3 bg-obsidian-850 p-2.5 rounded-lg border border-obsidian-750 flex items-center justify-between space-x-3">
            <button
              onClick={togglePlay}
              disabled={!videoUrl}
              className="p-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-gold-400 disabled:opacity-40 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-gold-400" />}
            </button>

            {/* Scrub Slider */}
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              disabled={!videoUrl}
              className="w-full accent-gold-500 h-1.5 bg-obsidian-900 rounded-lg cursor-pointer"
            />

            <button
              onClick={toggleMute}
              disabled={!videoUrl}
              className="p-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-platinum-300 disabled:opacity-40 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded bg-obsidian-800 hover:bg-obsidian-700 text-platinum-300 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Clip Inspector & Manual Editing Controls */}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMoveClip("left")}
                    title="Move clip left"
                    className="p-1 rounded bg-obsidian-800 hover:bg-obsidian-700 text-platinum-300 text-xs flex items-center border border-obsidian-700"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveClip("right")}
                    title="Move clip right"
                    className="p-1 rounded bg-obsidian-800 hover:bg-obsidian-700 text-platinum-300 text-xs flex items-center border border-obsidian-700"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-gold-400 font-mono bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">
                    {selectedClip.sceneId}
                  </span>
                </div>
              )}
            </div>

            {selectedClip ? (
              <div className="space-y-4 mt-4">
                {/* Duration & Transition Adjustment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-obsidian-900 p-3 rounded border border-obsidian-750 space-y-1.5">
                    <span className="text-platinum-400 font-mono block">Trim Clip Duration</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDurationChange(-0.5)}
                        className="px-2 py-1 bg-obsidian-800 hover:bg-obsidian-700 rounded text-platinum-200 border border-obsidian-700 font-mono font-bold"
                      >
                        -0.5s
                      </button>
                      <span className="text-gold-400 font-mono font-semibold px-2">
                        {selectedClip.duration}s
                      </span>
                      <button
                        onClick={() => handleDurationChange(0.5)}
                        className="px-2 py-1 bg-obsidian-800 hover:bg-obsidian-700 rounded text-platinum-200 border border-obsidian-700 font-mono font-bold"
                      >
                        +0.5s
                      </button>
                    </div>
                  </div>

                  <div className="bg-obsidian-900 p-3 rounded border border-obsidian-750 space-y-1.5">
                    <span className="text-platinum-400 font-mono block">Transition In</span>
                    <select
                      value={selectedClip.transitionIn?.type || "none"}
                      onChange={(e) => handleTransitionChange(e.target.value as TransitionType)}
                      className="w-full bg-obsidian-800 text-platinum-200 px-2.5 py-1 rounded border border-obsidian-700 font-mono text-xs focus:outline-none focus:border-gold-500/50"
                    >
                      <option value="none">Hard Cut (None)</option>
                      <option value="fade_to_black">Fade To Black</option>
                      <option value="dip_to_black">Dip To Black</option>
                      <option value="crossfade">Crossfade</option>
                      <option value="visual_continuity">Visual Continuity</option>
                    </select>
                  </div>
                </div>

                {/* Color Preset Selector */}
                <div className="bg-obsidian-900 p-3 rounded border border-obsidian-750 space-y-2">
                  <span className="text-platinum-400 font-mono text-xs block">Cinematic Color Preset</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(COLOR_PRESETS).map((presetName) => (
                      <button
                        key={presetName}
                        onClick={() => handlePresetSelect(presetName)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-all ${
                          selectedClip.colorPresetName === presetName
                            ? "bg-gold-500/20 text-gold-400 border-gold-500/50 font-bold"
                            : "bg-obsidian-800 text-platinum-400 border-obsidian-700 hover:text-platinum-200"
                        }`}
                      >
                        {presetName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Color Sliders */}
                <div className="bg-obsidian-900/90 p-3.5 rounded-lg border border-obsidian-750 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 font-mono font-semibold uppercase block">
                      Fine-Tune Color Parameters
                    </span>
                    <button
                      onClick={() => handlePresetSelect(selectedClip.colorPresetName)}
                      className="text-[10px] text-platinum-400 hover:text-gold-400 font-mono flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Preset</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div>
                      <div className="flex justify-between text-platinum-400 mb-1">
                        <span>Contrast</span>
                        <span>{selectedClip.color?.contrast?.toFixed(2) ?? "1.00"}</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={1.5}
                        step={0.05}
                        value={selectedClip.color?.contrast ?? 1.0}
                        onChange={(e) => handleColorParamChange("contrast", parseFloat(e.target.value))}
                        className="w-full accent-gold-500 h-1 bg-obsidian-800 rounded"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-platinum-400 mb-1">
                        <span>Exposure</span>
                        <span>{selectedClip.color?.exposure?.toFixed(2) ?? "0.00"}</span>
                      </div>
                      <input
                        type="range"
                        min={-0.5}
                        max={0.5}
                        step={0.05}
                        value={selectedClip.color?.exposure ?? 0.0}
                        onChange={(e) => handleColorParamChange("exposure", parseFloat(e.target.value))}
                        className="w-full accent-gold-500 h-1 bg-obsidian-800 rounded"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-platinum-400 mb-1">
                        <span>Saturation</span>
                        <span>{selectedClip.color?.saturation?.toFixed(2) ?? "1.00"}</span>
                      </div>
                      <input
                        type="range"
                        min={0.2}
                        max={1.8}
                        step={0.05}
                        value={selectedClip.color?.saturation ?? 1.0}
                        onChange={(e) => handleColorParamChange("saturation", parseFloat(e.target.value))}
                        className="w-full accent-gold-500 h-1 bg-obsidian-800 rounded"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-platinum-400 mb-1">
                        <span>Vignette</span>
                        <span>{selectedClip.color?.vignette?.toFixed(2) ?? "0.00"}</span>
                      </div>
                      <input
                        type="range"
                        min={0.0}
                        max={0.6}
                        step={0.05}
                        value={selectedClip.color?.vignette ?? 0.0}
                        onChange={(e) => handleColorParamChange("vignette", parseFloat(e.target.value))}
                        className="w-full accent-gold-500 h-1 bg-obsidian-800 rounded"
                      />
                    </div>
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
          <div className="bg-obsidian-850 p-4 rounded-xl border border-obsidian-700 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div>
              <span className="text-xs font-semibold text-platinum-200 block">
                FFmpeg Modular Render Engine
              </span>
              <p className="text-[11px] text-platinum-400">
                Compiles high-bitrate MP4 with color grading & J/L-cuts
              </p>
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
          <span className="text-xs text-platinum-400 font-mono">
            Total Duration: {totalDuration.toFixed(1)}s
          </span>
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
                      <span className="text-[10px] font-bold text-platinum-100 font-mono truncate">
                        {clip.sceneId}
                      </span>
                      <span className="text-[9px] text-gold-400 font-mono">{clip.duration}s</span>
                    </div>
                    <span className="text-[9px] text-platinum-400 truncate">{clip.colorPresetName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audio Tracks (A1 to A4) */}
          {timeline.audioTracks.map((track) => (
            <div key={track.id} className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-platinum-400">
                <div className="flex items-center space-x-2">
                  <Music className="w-3.5 h-3.5 text-blue-400" />
                  <span>{track.name}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleTrackMute(track.id)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      track.muted
                        ? "bg-red-500/20 border-red-500/40 text-red-400"
                        : "bg-obsidian-800 border-obsidian-700 text-platinum-400 hover:text-platinum-200"
                    }`}
                  >
                    {track.muted ? "Muted" : "Mute"}
                  </button>
                </div>
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
                        className={`h-full border rounded p-1.5 flex items-center justify-between text-[10px] font-mono shrink-0 transition-opacity ${
                          track.muted
                            ? "opacity-30 bg-gray-900 border-gray-700 text-gray-500"
                            : "bg-blue-950/60 border-blue-500/30 text-blue-300"
                        }`}
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
