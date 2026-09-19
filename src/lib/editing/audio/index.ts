import { AudioClipItem } from "../types";

export interface AudioTrackConfig {
  id: string;
  name: string;
  type: "A1_environment" | "A2_secondary" | "A3_voiceover" | "A4_music";
  gainDb: number; // e.g. 0 to -24 dB
  duckingThresholdDb?: number;
}

export interface AudioMixGraphResult {
  filterString: string;
  outputLabel: string;
}

/**
 * Builds modular audio filter graph strings for timeline mixing.
 */
export function buildTimelineAudioMixFilter(
  audioClips: AudioClipItem[]
): AudioMixGraphResult {
  if (audioClips.length === 0) {
    return {
      filterString: "anullsrc=channel_layout=stereo:sample_rate=48000[a_mixed]",
      outputLabel: "[a_mixed]",
    };
  }

  const audioFilters: string[] = [];
  const mixInputs: string[] = [];

  audioClips.forEach((clip, index) => {
    const inputIndex = index; // FFmpeg audio stream index mapping
    const delayMs = Math.round(Math.max(0, clip.timelineStart) * 1000);
    const volume = clip.volume ?? 0.85;

    const label = `a${index}`;
    const trimFilter = `atrim=0:${clip.duration},asetpts=PTS-STARTPTS`;
    const volFilter = `volume=${volume}`;
    const delayFilter = `adelay=${delayMs}|${delayMs}`;

    audioFilters.push(`[${inputIndex}:a]${trimFilter},${volFilter},${delayFilter}[${label}]`);
    mixInputs.push(`[${label}]`);
  });

  const amixFilter = `${mixInputs.join("")}amix=inputs=${audioClips.length}:duration=first:dropout_transition=2[a_mixed]`;
  const fullFilterGraph = `${audioFilters.join(";")};${amixFilter}`;

  return {
    filterString: fullFilterGraph,
    outputLabel: "[a_mixed]",
  };
}
