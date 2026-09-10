"use client";

import React, { useState } from "react";
import { Sparkles, Play, Smartphone, Monitor, Film, Wand2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string, aspect: "9:16" | "16:9") => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [targetAspect, setTargetAspect] = useState<"9:16" | "16:9">("9:16");

  const TEST_CONCEPT = "THE DEEP IS NOT EMPTY. A cinematic journey from the vast ocean surface down into the dark abyssal depths where unexpected bioluminescent life thrives.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt, targetAspect);
  };

  const handleQuickLaunchTest = () => {
    setPrompt(TEST_CONCEPT);
    setTargetAspect("9:16");
    onSubmit(TEST_CONCEPT, "9:16");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quick Launch Banner */}
      <div className="glass-panel-gold rounded-xl p-5 border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/40">
                Official Benchmark Test
              </span>
            </div>
            <h3 className="font-semibold text-base text-platinum-100 mt-0.5">THE DEEP IS NOT EMPTY</h3>
            <p className="text-xs text-platinum-400 max-w-xl mt-0.5">
              48s Oceanic Descent documentary from vast surface waves down into abyssal darkness with ROV exploration & hydrophone audio.
            </p>
          </div>
        </div>

        <button
          onClick={handleQuickLaunchTest}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-obsidian-950 font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-lg shadow-gold-500/20 shrink-0"
        >
          <Play className="w-4 h-4 fill-obsidian-950" />
          <span>Launch Test Benchmark</span>
        </button>
      </div>

      {/* Main Creation Card */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6 border border-obsidian-700 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-gold-400" />
            <h2 className="font-semibold text-base text-platinum-100">Create New Cinematic Documentary Project</h2>
          </div>
          <span className="text-xs text-platinum-500 font-mono">Gemini Director Engine</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-platinum-300 mb-2">
            Enter Concept, Script, or Storyboard Idea
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe your documentary story arc... e.g. 'Volcanic eruptions beneath glacial ice in Iceland: heat meets freeze, extreme geological contrast and atmospheric silence.'"
            className="w-full px-4 py-3 bg-obsidian-900 border border-obsidian-750 rounded-lg text-sm text-platinum-100 placeholder-platinum-500 focus:outline-none focus:border-gold-500/50 resize-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-platinum-300 mb-2">Target Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetAspect("9:16")}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                  targetAspect === "9:16"
                    ? "bg-gold-500/10 border-gold-500/50 text-gold-400"
                    : "bg-obsidian-900 border-obsidian-750 text-platinum-400 hover:border-obsidian-700"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>9:16 Vertical (Shorts)</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAspect("16:9")}
                className={`px-3 py-2.5 rounded-lg border text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                  targetAspect === "16:9"
                    ? "bg-gold-500/10 border-gold-500/50 text-gold-400"
                    : "bg-obsidian-900 border-obsidian-750 text-platinum-400 hover:border-obsidian-700"
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>16:9 Landscape</span>
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full h-[42px] rounded-lg bg-obsidian-750 hover:bg-obsidian-700 border border-gold-500/30 text-gold-400 hover:text-gold-300 font-semibold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  <span>AI Director Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Director Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
