import { GoogleGenAI } from "@google/genai";
import { AIDirectorProvider } from "./types";
import { DirectorPlan, DirectorPlanSchema } from "../schemas/director-plan";

export class GeminiDirectorProvider implements AIDirectorProvider {
  readonly name = "Gemini AI Director";
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
  }

  async generateDirectorPlan(prompt: string, targetAspect: "9:16" | "16:9" = "9:16"): Promise<DirectorPlan> {
    if (!this.apiKey) {
      console.warn("GEMINI_API_KEY is not set. Using AI Director fallback system for:", prompt);
      return this.getFallbackDirectorPlan(prompt, targetAspect);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.apiKey });
      const systemInstruction = `
You are a senior software architect, professional documentary filmmaker, cinematographer, colorist, sound designer, and senior video editor.
Your task is to analyze the prompt and generate a highly detailed, professional, structured DIRECTOR PLAN for a cinematic documentary video.

IMPORTANT EDITING PRINCIPLES:
1. DO NOT CREATE A SLIDESHOW. Every cut must have a narrative purpose.
2. Vary shot types intelligently (extreme_wide, wide, medium, close_up, macro_detail, aerial, pov, environmental, scientific).
3. Dynamic shot pacing: longer shots for scale/atmosphere (5.5s-7.5s), shorter shots for information/tension (3.5s-5.0s).
4. Audio continuity: Include J-cuts (sound begins before scene cut, e.g. -0.5s to -1.5s) and L-cuts (sound continues past scene cut).
5. Colors must match the visual character (Natural Documentary, Deep Ocean, Cold Scientific, Night, Warm Memory, Neutral).
6. Provide deep editorial reasoning for EVERY scene (WHY THIS SHOT, WHY THIS DURATION, WHY THIS CUT, WHY THIS TRANSITION, WHY THIS SOUND, WHY THIS COLOR).

OUTPUT MUST BE VALID JSON conforming strictly to the requested structure.
`;

      const userPrompt = `
Generate a structured Director Plan for the project prompt: "${prompt}"
Target Aspect Ratio: ${targetAspect}
Output JSON format only. No markdown formatting or extra text outside JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\n\n${userPrompt}`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "";
      const parsedJson = JSON.parse(responseText);

      // Validate with Zod
      const validatedPlan = DirectorPlanSchema.parse(parsedJson);
      return validatedPlan;
    } catch (err) {
      console.error("Gemini AI Director API error or parse failure. Falling back to fallback director plan:", err);
      return this.getFallbackDirectorPlan(prompt, targetAspect);
    }
  }

  private getFallbackDirectorPlan(prompt: string, targetAspect: "9:16" | "16:9"): DirectorPlan {
    const isDeepSea = prompt.toLowerCase().includes("deep") || prompt.toLowerCase().includes("ocean") || prompt.toLowerCase().includes("empty");

    if (isDeepSea) {
      return {
        title: "THE DEEP IS NOT EMPTY",
        concept: prompt || "A cinematic journey from the vast surface of the ocean down into the dark abyssal depths where unexpected life thrives.",
        targetAspect: targetAspect,
        estimatedDuration: 48,
        storyArc: "Establishment of human baseline surface -> Transition into mysterious underwater threshold -> Total loss of sunlight/familiarity -> Revelation of abyssal life -> Technological human presence -> Final return to black quietude.",
        visualLanguage: "Subtle organic camera movement, descending luminance, deep blue to dark indigo color gradient, high contrast macro details in darkness.",
        colorLanguage: "Cool oceanic blues transitioning to desaturated cold scientific indigo and dark abyssal black with bioluminescent highlights.",
        editingStyle: "Restrained documentary cutting with purposeful pacing. Long establishing shots followed by deliberate visual transitions.",
        pacing: "Slower establishing shot (6.2s) -> Immersive descent (5.4s) -> Moody fade into darkness (6.1s) -> Sharp discovery macro shot (4.5s) -> Steady ROV exploration (7.0s) -> Abyssal black finish.",
        soundLanguage: "Natural hydrophone recordings, subterranean low-frequency rumbles, mechanical submersible hum, sonar acoustics.",
        scenes: [
          {
            sceneId: "scene_01",
            duration: 6.2,
            purpose: "Establish human baseline scale and oceanic isolation.",
            emotion: "Awe and calm isolation",
            visualGoal: "Show boundless ocean surface under open sky.",
            shotType: "extreme_wide",
            cameraAngle: "Eye-level horizon",
            cameraMotion: "Subtle slow drift",
            composition: "Rule of thirds ocean line",
            lighting: "Bright natural daylight",
            colorPreset: "Natural Documentary",
            selectedAssetQuery: "vast ocean surface waves horizon",
            selectionReason: "Captures the vastness of the open ocean before descending below.",
            cutStrategy: "hard_cut",
            transitionDuration: 0.8,
            soundQuery: "ocean surface waves wind ambience",
            soundCategory: "environment",
            soundDuration: 8.0,
            soundLevel: 0.8,
            jCutOffset: 0,
            lCutOffset: 1.0,
            editorialNotes: {
              whyThisShot: "Extreme wide establishes scale and isolates the viewer on the surface before dipping into the deep.",
              whyThisDuration: "6.2 seconds allows the viewer to absorb the massive scale and absorb the natural ocean environment.",
              whyThisCut: "A clean hard cut into underwater establishes a abrupt physical threshold transition.",
              whyThisTransition: "Standard cut to maintain raw documentary feel.",
              whyThisSound: "Natural wave sounds ground the viewer in real acoustic reality.",
              whyThisColor: "Natural documentary lighting provides the baseline visual reality before color shifts underwater."
            }
          },
          {
            sceneId: "scene_02",
            duration: 5.4,
            purpose: "Physically move the viewer from known surface world into the unknown underwater world.",
            emotion: "Subtle disorientation and curiosity",
            visualGoal: "Sunlight rays piercing down underwater.",
            shotType: "wide",
            cameraAngle: "Looking upward toward surface",
            cameraMotion: "Slow upward pan angle",
            composition: "Diagonal light beams crossing frame",
            lighting: "Filtered sunbeams in clear water",
            colorPreset: "Deep Ocean",
            selectedAssetQuery: "underwater sunlight rays blue water",
            selectionReason: "Visually communicates entering the liquid element with sunlight filtering down.",
            cutStrategy: "visual_continuity",
            transitionDuration: 1.0,
            soundQuery: "underwater hydrophone submerged ambience",
            soundCategory: "environment",
            soundDuration: 7.0,
            soundLevel: 0.85,
            jCutOffset: -1.0, // Hydrophone sound starts 1s before cut
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Looking up at sunlight through water reinforces the depth beneath us.",
              whyThisDuration: "5.4 seconds creates a seamless feeling of sinking beneath the surface.",
              whyThisCut: "Visual continuity cut matches the fluid motion of water.",
              whyThisTransition: "Crossfade blends light streams continuously.",
              whyThisSound: "Muffled hydrophone audio J-cut introduces underwater acoustics slightly before the visual cut.",
              whyThisColor: "Deep ocean cyan highlights the underwater blue spectrum."
            }
          },
          {
            sceneId: "scene_03",
            duration: 6.1,
            purpose: "Visual loss of familiarity and fading sunlight.",
            emotion: "Apprehension and solemn focus",
            visualGoal: "Deeper blue waters fading into shadowy darkness.",
            shotType: "environmental",
            cameraAngle: "Looking down into abyss",
            cameraMotion: "Subtle slow push-in",
            composition: "Vignetted darkness at edges",
            lighting: "Dimming twilight underwater",
            colorPreset: "Cold Scientific",
            selectedAssetQuery: "deep blue water abyss dark underwater view",
            selectionReason: "Conveys the loss of solar radiation as depth increases.",
            cutStrategy: "crossfade",
            transitionDuration: 1.2,
            soundQuery: "deep sea pressure low frequency rumble",
            soundCategory: "environment",
            soundDuration: 8.0,
            soundLevel: 0.9,
            jCutOffset: -0.8,
            lCutOffset: 0.8,
            editorialNotes: {
              whyThisShot: "Environmental ocean depth shot visually strips away daylight.",
              whyThisDuration: "6.1 seconds gives time for the darkness to visually press into the frame.",
              whyThisCut: "Crossfade smoothly dissolves light into darkness.",
              whyThisTransition: "Gradual crossfade emphasizes gradual descent.",
              whyThisSound: "Subterranean rumble introduces physical pressure.",
              whyThisColor: "Cold scientific palette desaturates warm tones to signal deep water depth."
            }
          },
          {
            sceneId: "scene_04",
            duration: 4.5,
            purpose: "Reveal that life exists beyond human visibility in total darkness.",
            emotion: "Wonder and astonishment",
            visualGoal: "Macro detail of deep sea bioluminescent organism.",
            shotType: "macro_detail",
            cameraAngle: "Close macro level",
            cameraMotion: "Controlled float",
            composition: "Centered glowing creature against black",
            lighting: "Self-illuminating bioluminescence",
            colorPreset: "Night",
            selectedAssetQuery: "deep sea organism bioluminescent dark water",
            selectionReason: "Directly proves the core thesis: The deep is NOT empty.",
            cutStrategy: "motivated_cut",
            transitionDuration: 0.5,
            soundQuery: "deep water hydrophone subtle organic pulse",
            soundCategory: "environment",
            soundDuration: 6.0,
            soundLevel: 0.75,
            jCutOffset: -0.5,
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Macro detail puts the delicate bioluminescent life form in crisp focus.",
              whyThisDuration: "4.5 seconds provides a punchy, surprising reveal of living organisms.",
              whyThisCut: "Motivated cut timed with the organism's luminescent pulse.",
              whyThisTransition: "Quick transition heightens the shock of discovery.",
              whyThisSound: "High frequency hydrophone clicks mimic organic sonar.",
              whyThisColor: "Night preset contrast blacks out background to emphasize luminescent highlights."
            }
          },
          {
            sceneId: "scene_05",
            duration: 7.0,
            purpose: "Show humanity's scientific technology operating against enormous abyssal scale.",
            emotion: "Technical reverence and vast scale",
            visualGoal: "Submersible ROV lights illuminating the abyssal seafloor.",
            shotType: "scientific",
            cameraAngle: "High tracking angle",
            cameraMotion: "Subtle forward tracking pan",
            composition: "ROV in lower third with artificial searchlights scanning floor",
            lighting: "Artificial high-intensity LED searchlights",
            colorPreset: "Cold Scientific",
            selectedAssetQuery: "submersible rov abyssal floor dark water bubbles",
            selectionReason: "Introduces human exploration technology venturing into the deepest frontier.",
            cutStrategy: "hard_cut",
            transitionDuration: 1.0,
            soundQuery: "submersible mechanical hum sonar ping",
            soundCategory: "secondary_effects",
            soundDuration: 9.0,
            soundLevel: 0.85,
            jCutOffset: -1.0,
            lCutOffset: 1.0,
            editorialNotes: {
              whyThisShot: "Scientific tracking shot places technology in contrast with infinite ocean void.",
              whyThisDuration: "7.0 seconds allows the ROV searchlight beam to sweep across the frame.",
              whyThisCut: "Hard cut underscores human mechanical presence.",
              whyThisTransition: "Fade to black ending transition.",
              whyThisSound: "Mechanical thruster hum and intermittent sonar pings signal deep research.",
              whyThisColor: "Cold scientific preset sharpens metal surfaces and LED searchlight beams."
            }
          }
        ]
      };
    }

    // Default generic fallback for non-deep-sea prompts
    return {
      title: "CINEMATIC DOCUMENTARY EXPLORATION",
      concept: prompt,
      targetAspect: targetAspect,
      estimatedDuration: 30,
      storyArc: "Introduction -> Development -> Climax -> Resolution",
      visualLanguage: "High contrast cinematic documentary framing with intentional lighting and movement.",
      colorLanguage: "Natural tones with subtle color balance.",
      editingStyle: "Pacing driven by story progression.",
      pacing: "Balanced documentary rhythm.",
      soundLanguage: "Environmental soundscapes and natural acoustics.",
      scenes: [
        {
          sceneId: "scene_01",
          duration: 6.0,
          purpose: "Establish subject atmosphere.",
          emotion: "Curiosity",
          visualGoal: "Wide opening view.",
          shotType: "wide",
          cameraAngle: "Eye level",
          cameraMotion: "Subtle pan",
          composition: "Balanced landscape",
          lighting: "Natural daylight",
          colorPreset: "Natural Documentary",
          selectedAssetQuery: prompt,
          selectionReason: "Establishes context.",
          cutStrategy: "hard_cut",
          transitionDuration: 0.5,
          soundQuery: "environmental atmosphere",
          soundCategory: "environment",
          soundDuration: 7.0,
          soundLevel: 0.8,
          jCutOffset: 0,
          lCutOffset: 0,
          editorialNotes: {
            whyThisShot: "Establishes context.",
            whyThisDuration: "Allows narrative setup.",
            whyThisCut: "Standard documentary cut.",
            whyThisTransition: "Clean cut.",
            whyThisSound: "Acoustic realism.",
            whyThisColor: "Natural tone."
          }
        }
      ]
    };
  }
}
