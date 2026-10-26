"use client";

import React, { useState } from "react";
import { DirectorPlan, DirectorScene } from "@/lib/schemas/director-plan";
import { MediaAsset } from "@/lib/providers/types";
import { ChevronDown, ChevronUp, Eye, Music, Palette, Film, Award, HelpCircle } from "lucide-react";

interface DirectorPlanViewProps {
  plan: DirectorPlan;
  selectedAssets?: { sceneId: string; video: MediaAsset; sound?: unknown }[];
}

export function DirectorPlanView({ plan, selectedAssets = [] }: DirectorPlanViewProps) {
  const [expandedScenes, setExpandedScenes] = useState<Record<string, boolean>>({
    scene_01: true, // Expand first scene by default
  });

  const toggleScene = (id: string) => {
    setExpandedScenes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* High-Level Editorial Vision Card */}
      <div className="glass-panel-gold rounded-xl p-6 border border-gold-500/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-obsidian-700 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                AI Director Blueprint
              </span>
              <span className="text-xs text-platinum-400 font-mono">Aspect: {plan.targetAspect}</span>
              <span className="text-xs text-platinum-400 font-mono">Total: ~{plan.estimatedDuration}s</span>
            </div>
            <h2 className="text-xl font-bold text-platinum-100 mt-1">{plan.title}</h2>
          </div>
        </div>

        <p className="text-sm text-platinum-300 italic border-l-2 border-gold-500/50 pl-3 py-1">
          &ldquo;{plan.concept}&rdquo;
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-obsidian-900/60 p-3 rounded-lg border border-obsidian-750">
            <span className="text-[11px] font-semibold uppercase text-gold-400 font-mono block mb-1">Story Arc</span>
            <p className="text-xs text-platinum-300">{plan.storyArc}</p>
          </div>

          <div className="bg-obsidian-900/60 p-3 rounded-lg border border-obsidian-750">
            <span className="text-[11px] font-semibold uppercase text-gold-400 font-mono block mb-1">Visual Language</span>
            <p className="text-xs text-platinum-300">{plan.visualLanguage}</p>
          </div>

          <div className="bg-obsidian-900/60 p-3 rounded-lg border border-obsidian-750">
            <span className="text-[11px] font-semibold uppercase text-gold-400 font-mono block mb-1">Color Palette</span>
            <p className="text-xs text-platinum-300">{plan.colorLanguage}</p>
          </div>

          <div className="bg-obsidian-900/60 p-3 rounded-lg border border-obsidian-750">
            <span className="text-[11px] font-semibold uppercase text-gold-400 font-mono block mb-1">Sound Design</span>
            <p className="text-xs text-platinum-300">{plan.soundLanguage}</p>
          </div>
        </div>
      </div>

      {/* Scene Breakdown */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-platinum-200 tracking-wider uppercase font-mono flex items-center space-x-2">
          <Film className="w-4 h-4 text-gold-400" />
          <span>Scene-by-Scene Editorial Decisions ({plan.scenes.length} Scenes)</span>
        </h3>

        {plan.scenes.map((scene: DirectorScene, idx: number) => {
          const isExpanded = expandedScenes[scene.sceneId];
          const assetMatch = selectedAssets.find((a) => a.sceneId === scene.sceneId);
          const videoAsset = assetMatch?.video;
          const score = videoAsset?.score;

          return (
            <div
              key={scene.sceneId}
              className="glass-panel rounded-xl border border-obsidian-700 overflow-hidden transition-all shadow-md"
            >
              {/* Scene Card Header */}
              <div
                onClick={() => toggleScene(scene.sceneId)}
                className="p-4 bg-obsidian-850 hover:bg-obsidian-800 cursor-pointer flex flex-wrap items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-lg bg-obsidian-750 border border-gold-500/30 text-gold-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-platinum-100">{scene.purpose}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-obsidian-750 border border-obsidian-600 text-platinum-400 font-mono">
                        {scene.duration}s
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5 text-xs text-platinum-400">
                      <span>Shot: {scene.shotType}</span>
                      <span>•</span>
                      <span>Cut: {scene.cutStrategy}</span>
                      <span>•</span>
                      <span>Color: {scene.colorPreset}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {score && (
                    <div className="flex items-center space-x-1.5 bg-gold-500/10 border border-gold-500/30 px-2.5 py-1 rounded-md text-gold-400 font-mono text-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>Shot Score: {score.overall}/100</span>
                    </div>
                  )}

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-platinum-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-platinum-400" />
                  )}
                </div>
              </div>

              {/* Scene Expanded Editorial Reasoning */}
              {isExpanded && (
                <div className="p-5 border-t border-obsidian-750 bg-obsidian-900/80 space-y-4">
                  {/* Selected Asset Info */}
                  {videoAsset && (
                    <div className="bg-obsidian-800/80 p-3.5 rounded-lg border border-obsidian-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-4 h-4 text-gold-400 shrink-0" />
                        <div>
                          <span className="text-[11px] text-platinum-400 font-mono uppercase block">Selected Stock Asset</span>
                          <span className="text-xs font-semibold text-platinum-200">{videoAsset.title}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-platinum-400 bg-obsidian-900 px-2 py-1 rounded border border-obsidian-750">
                        {scene.selectionReason}
                      </span>
                    </div>
                  )}

                  {/* Editorial "WHY" Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                    <div className="bg-obsidian-850 p-3 rounded-lg border border-obsidian-750 space-y-1">
                      <div className="flex items-center space-x-1.5 text-gold-400 text-[11px] font-semibold uppercase font-mono">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why This Shot & Duration?</span>
                      </div>
                      <p className="text-xs text-platinum-300 leading-relaxed">
                        {scene.editorialNotes?.whyThisShot} {scene.editorialNotes?.whyThisDuration}
                      </p>
                    </div>

                    <div className="bg-obsidian-850 p-3 rounded-lg border border-obsidian-750 space-y-1">
                      <div className="flex items-center space-x-1.5 text-gold-400 text-[11px] font-semibold uppercase font-mono">
                        <Music className="w-3.5 h-3.5" />
                        <span>Why This Sound Design?</span>
                      </div>
                      <p className="text-xs text-platinum-300 leading-relaxed">
                        {scene.editorialNotes?.whyThisSound}
                        {(scene.jCutOffset !== 0 || scene.lCutOffset !== 0) && (
                          <span className="block mt-1 text-[11px] text-gold-400 font-mono">
                            J/L-Cut: J-Offset ({scene.jCutOffset}s) / L-Offset ({scene.lCutOffset}s)
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="bg-obsidian-850 p-3 rounded-lg border border-obsidian-750 space-y-1">
                      <div className="flex items-center space-x-1.5 text-gold-400 text-[11px] font-semibold uppercase font-mono">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Why This Color Grade?</span>
                      </div>
                      <p className="text-xs text-platinum-300 leading-relaxed">
                        {scene.editorialNotes?.whyThisColor}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
