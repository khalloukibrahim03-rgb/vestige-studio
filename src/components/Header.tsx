"use client";

import React from "react";
import { Sparkles, Film, Compass, Settings, Key, Sliders, Layers } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  activeTab: "dashboard" | "director" | "timeline" | "export";
  setActiveTab: (tab: "dashboard" | "director" | "timeline" | "export") => void;
  hasProject: boolean;
}

export function Header({ onOpenSettings, activeTab, setActiveTab, hasProject }: HeaderProps) {
  return (
    <header className="border-b border-obsidian-700 bg-obsidian-900/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Title */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shadow-sm shadow-gold-500/10">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-lg tracking-wider text-platinum-100 uppercase font-mono">
              VESTIGE <span className="text-gold-500 font-light">STUDIO</span>
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded border border-gold-500/30 text-gold-400 bg-gold-500/10 font-mono tracking-widest">
              CINEMATIC AI
            </span>
          </div>
          <p className="text-xs text-platinum-500 hidden sm:block">Cinematic AI Video Editing Engine</p>
        </div>
      </div>

      {/* Navigation Tabs (if project exists) */}
      {hasProject && (
        <nav className="flex items-center space-x-1 bg-obsidian-850 p-1 rounded-lg border border-obsidian-700">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "dashboard"
                ? "bg-obsidian-700 text-platinum-100 border border-obsidian-600 shadow-sm"
                : "text-platinum-400 hover:text-platinum-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("director")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "director"
                ? "bg-obsidian-700 text-gold-400 border border-gold-500/30 shadow-sm"
                : "text-platinum-400 hover:text-platinum-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>AI Director</span>
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "timeline"
                ? "bg-obsidian-700 text-platinum-100 border border-obsidian-600 shadow-sm"
                : "text-platinum-400 hover:text-platinum-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === "export"
                ? "bg-obsidian-700 text-platinum-100 border border-obsidian-600 shadow-sm"
                : "text-platinum-400 hover:text-platinum-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Render</span>
          </button>
        </nav>
      )}

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-platinum-400 hover:text-gold-400 transition-all flex items-center space-x-1.5 text-xs"
        >
          <Key className="w-4 h-4" />
          <span className="hidden sm:inline">API Keys</span>
        </button>
      </div>
    </header>
  );
}
