import { ColorConfig } from "../types";

export interface ColorPreset {
  name: string;
  description: string;
  config: ColorConfig;
}

export const CINEMATIC_COLOR_PRESETS: Record<string, ColorPreset> = {
  "Natural Documentary": {
    name: "Natural Documentary",
    description: "Unprocessed, authentic documentary realism with pristine color balance.",
    config: {
      exposure: 0,
      contrast: 1.05,
      saturation: 1.0,
      temperature: 0,
      vignette: 0.1,
    },
  },
  "Deep Ocean": {
    name: "Deep Ocean",
    description: "Cool underwater cyan-blue depth with enhanced deep shadow contrast.",
    config: {
      exposure: -0.1,
      contrast: 1.15,
      saturation: 1.1,
      temperature: -0.3,
      tint: -0.1,
      vignette: 0.35,
    },
  },
  "Cold Scientific": {
    name: "Cold Scientific",
    description: "Desaturated indigo and steel-gray look ideal for scientific equipment and deep sea ROVs.",
    config: {
      exposure: -0.05,
      contrast: 1.2,
      saturation: 0.8,
      temperature: -0.4,
      tint: 0.05,
      vignette: 0.25,
    },
  },
  "Night": {
    name: "Night",
    description: "Crushed abyssal darks accentuating bright bioluminescent lights.",
    config: {
      exposure: -0.2,
      contrast: 1.3,
      saturation: 1.2,
      temperature: -0.2,
      vignette: 0.5,
    },
  },
  "Warm Memory": {
    name: "Warm Memory",
    description: "Subtle amber golden glow for historical or reflective sequences.",
    config: {
      exposure: 0.05,
      contrast: 1.0,
      saturation: 1.05,
      temperature: 0.25,
      tint: 0.05,
      vignette: 0.15,
    },
  },
  "Neutral": {
    name: "Neutral",
    description: "Completely flat color profile for maximum dynamic range.",
    config: {
      exposure: 0,
      contrast: 1.0,
      saturation: 1.0,
      temperature: 0,
      vignette: 0,
    },
  },
};

export function getColorPreset(name: string): ColorPreset {
  return CINEMATIC_COLOR_PRESETS[name] || CINEMATIC_COLOR_PRESETS["Natural Documentary"];
}
