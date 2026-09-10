"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { SettingsModal } from "@/components/SettingsModal";
import { PromptInput } from "@/components/PromptInput";
import { DirectorPlanView } from "@/components/DirectorPlanView";
import { TimelineView } from "@/components/TimelineView";
import { ProjectData } from "@/lib/services/project-store";
import { Sparkles, Download, RefreshCw, CheckCircle2, Film, Wand2 } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "director" | "timeline" | "export">("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    geminiApiKey: "",
    pexelsApiKey: "",
    freesoundApiKey: "",
  });

  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCreateProject = async (prompt: string, targetAspect: "9:16" | "16:9") => {
    setIsLoading(true);
    setStatusMessage("Gemini AI Director analyzing narrative arc & storyboard...");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, targetAspect, apiKeys }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      setCurrentProject(data.project);
      setActiveTab("director");
    } catch (err: any) {
      alert(`Error creating project: ${err.message}`);
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleRenderRequest = async () => {
    if (!currentProject) return;

    setIsRendering(true);
    try {
      const res = await fetch(`/api/projects/${currentProject.id}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presetId: "SHORT_HIGH" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger render");

      setCurrentProject(data.project);
    } catch (err: any) {
      alert(`Render error: ${err.message}`);
      setIsRendering(false);
    }
  };

  const pollProjectStatus = useCallback(async () => {
    if (!currentProject || !isRendering) return;

    try {
      const res = await fetch(`/api/projects/${currentProject.id}/render`);
      const data = await res.json();

      if (res.ok && data.project) {
        setCurrentProject(data.project);
        if (data.project.status === "completed") {
          setIsRendering(false);
          setActiveTab("export");
        } else if (data.project.status === "failed") {
          setIsRendering(false);
          alert(`Render failed: ${data.project.renderProgress?.message}`);
        }
      }
    } catch (err) {
      console.error("Failed to poll project status:", err);
    }
  }, [currentProject, isRendering]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRendering && currentProject) {
      interval = setInterval(() => {
        pollProjectStatus();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRendering, currentProject, pollProjectStatus]);

  return (
    <div className="min-h-screen bg-obsidian-900 text-platinum-100 flex flex-col font-sans">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasProject={!!currentProject}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKeys={apiKeys}
        onSave={(keys) => setApiKeys(keys)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {isLoading && (
          <div className="glass-panel-gold rounded-xl p-8 text-center space-y-4 border border-gold-500/30 max-w-md mx-auto my-12 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto">
              <Wand2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-platinum-100">AI Director Processing</h3>
              <p className="text-xs text-platinum-400 mt-1">{statusMessage}</p>
            </div>
          </div>
        )}

        {!isLoading && activeTab === "dashboard" && (
          <PromptInput onSubmit={handleCreateProject} isLoading={isLoading} />
        )}

        {!isLoading && activeTab === "director" && currentProject?.directorPlan && (
          <DirectorPlanView
            plan={currentProject.directorPlan}
            selectedAssets={currentProject.selectedAssets}
          />
        )}

        {!isLoading && activeTab === "timeline" && currentProject?.timeline && (
          <TimelineView
            timeline={currentProject.timeline}
            videoUrl={currentProject.renderedVideoUrl}
            onRenderRequest={handleRenderRequest}
            isRendering={isRendering}
          />
        )}

        {!isLoading && activeTab === "export" && (
          <div className="max-w-xl mx-auto glass-panel-gold rounded-xl p-8 border border-gold-500/30 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-platinum-100">Render Complete</h2>
              <p className="text-xs text-platinum-400 mt-1">
                Your cinematic video is ready for export in 1080x1920 Shorts format.
              </p>
            </div>

            {currentProject?.renderedVideoUrl && (
              <div className="relative aspect-[9/16] h-[360px] mx-auto bg-black rounded-lg overflow-hidden border border-gold-500/30 shadow-2xl">
                <video src={currentProject.renderedVideoUrl} controls autoPlay className="w-full h-full object-contain" />
              </div>
            )}

            <div className="flex justify-center space-x-3 pt-2">
              {currentProject?.renderedVideoUrl && (
                <a
                  href={currentProject.renderedVideoUrl}
                  download="vestige_cinematic_export.mp4"
                  className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-gold-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
              )}

              <button
                onClick={() => setActiveTab("timeline")}
                className="px-5 py-2.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-platinum-200 border border-obsidian-700 font-semibold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Adjust Timeline</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
