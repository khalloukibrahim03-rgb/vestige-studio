"use client";

import React, { useState } from "react";
import { Key, X, Check, ExternalLink, ShieldCheck } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: {
    geminiApiKey: string;
    pexelsApiKey: string;
    freesoundApiKey: string;
  };
  onSave: (keys: { geminiApiKey: string; pexelsApiKey: string; freesoundApiKey: string }) => void;
}

export function SettingsModal({ isOpen, onClose, apiKeys, onSave }: SettingsModalProps) {
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiApiKey);
  const [pexelsKey, setPexelsKey] = useState(apiKeys.pexelsApiKey);
  const [freesoundKey, setFreesoundKey] = useState(apiKeys.freesoundApiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      geminiApiKey: geminiKey,
      pexelsApiKey: pexelsKey,
      freesoundApiKey: freesoundKey,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md">
      <div className="glass-panel-gold rounded-xl w-full max-w-lg p-6 shadow-2xl relative border border-gold-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-platinum-500 hover:text-platinum-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-platinum-100">API Provider Configuration</h2>
            <p className="text-xs text-platinum-400">Connect live AI, Video, and Sound services</p>
          </div>
        </div>

        <div className="space-y-4 my-5">
          {/* Gemini */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-platinum-300">Gemini API Key (AI Director)</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-gold-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded-lg text-sm text-platinum-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          {/* Pexels */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-platinum-300">Pexels API Key (Footage)</label>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-gold-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="563492ad6f91700001000001..."
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded-lg text-sm text-platinum-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          {/* Freesound */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-platinum-300">Freesound API Key (Soundscapes)</label>
              <a
                href="https://freesound.org/apiv2/apply"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-gold-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="Client ID / Secret Token"
              value={freesoundKey}
              onChange={(e) => setFreesoundKey(e.target.value)}
              className="w-full px-3 py-2 bg-obsidian-900 border border-obsidian-700 rounded-lg text-sm text-platinum-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        <div className="bg-obsidian-900/60 p-3 rounded-lg border border-obsidian-750 flex items-start space-x-2.5 mb-6 text-xs text-platinum-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            When API keys are not provided, VESTIGE Studio seamlessly activates its built-in curated cinematic media engine and offline Director models.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-platinum-400 hover:text-platinum-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-medium bg-gold-500 hover:bg-gold-400 text-obsidian-950 flex items-center space-x-1.5 transition-all shadow-md shadow-gold-500/10"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
}
