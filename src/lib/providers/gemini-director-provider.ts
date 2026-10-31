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
3. Dynamic shot pacing: longer shots for scale/atmosphere (5.0s-7.5s), shorter shots for information/tension (3.0s-4.5s).
4. Audio continuity: Include J-cuts (sound begins before scene cut, e.g. -0.5s to -1.5s) and L-cuts (sound continues past scene cut).
5. Colors must match the visual character (Natural Documentary, Deep Ocean, Cold Scientific, Night, Warm Memory, Neutral).
6. Provide deep editorial reasoning for EVERY scene (WHY THIS SHOT, WHY THIS DURATION, WHY THIS CUT, WHY THIS TRANSITION, WHY THIS SOUND, WHY THIS COLOR).

OUTPUT MUST BE VALID JSON conforming strictly to the DirectorPlan schema.
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
        concept: "A cinematic descent from the vast surface of the ocean into the dark abyssal depths, revealing that life thrives in the deepest silence.",
        targetAspect: targetAspect,
        estimatedDuration: 48,
        storyArc: "Black screen silence -> Vast ocean surface -> Plunge below surface -> Sunlight beams piercing down -> Twilight zone deeper water -> Abyssal darkness -> Discovery of bioluminescent life -> ROV exploration searchlights -> Untouched abyssal seafloor -> Final descent into black quietude.",
        visualLanguage: "Subtle organic camera drift, progressive descending luminance, transition from natural ocean cyan to cold abyssal indigo with vivid bioluminescent highlights.",
        colorLanguage: "Natural Documentary sunlight transitioning into Deep Ocean cyan, Cold Scientific indigo, and high-contrast Night abyss.",
        editingStyle: "Restrained documentary cutting with purposeful pacing. Long establishing shots followed by deliberate visual continuity and motivated cuts.",
        pacing: "Measured documentary rhythm: 2.5s opening black silence -> 5.5s expansive horizon -> 4.5s threshold immersion -> 5.0s sunlight shimmer -> 5.5s twilight descent -> 5.5s abyssal darkness -> 5.0s sharp discovery macro -> 6.0s technological exploration -> 5.5s abyss floor -> 3.0s closing black fade.",
        soundLanguage: "Natural acoustic hydrophone recordings, ocean surface wind, subterranean low-frequency pressure rumbles, submersible mechanical hum, sonar acoustics.",
        scenes: [
          {
            sceneId: "scene_01",
            duration: 2.5,
            purpose: "Establish sensory isolation and silence before visual immersion begins.",
            emotion: "Anticipation and solemn quietude",
            visualGoal: "Pure black screen slug holding viewer attention in complete darkness.",
            shotType: "environmental",
            cameraAngle: "Neutral void",
            cameraMotion: "none",
            composition: "Centering black space",
            lighting: "Zero luminance",
            colorPreset: "Neutral",
            selectedAssetQuery: "black screen void darkness slug",
            selectionReason: "Direct black frame creates sensory palate cleanser before opening on the ocean.",
            cutStrategy: "fade_to_black",
            transitionDuration: 0.5,
            soundCategory: "silence",
            soundDuration: 2.5,
            soundLevel: 0.0,
            jCutOffset: 0,
            lCutOffset: 0,
            editorialNotes: {
              whyThisShot: "Black opening creates sensory isolation and forces focus before the visual narrative unfolds.",
              whyThisDuration: "2.5 seconds allows the audience to settle their focus without lingering into confusion.",
              whyThisCut: "Fade up introduces the vast ocean gradually from nothingness.",
              whyThisTransition: "Soft fade establishes a documentary prologue tone.",
              whyThisSound: "Absolute silence primes the acoustic senses for the first ocean sound.",
              whyThisColor: "Pure neutral black resets the viewer's color adaptation."
            }
          },
          {
            sceneId: "scene_02",
            duration: 5.5,
            purpose: "Establish human baseline scale and oceanic isolation under open sky.",
            emotion: "Awe and calm isolation",
            visualGoal: "Vast boundless ocean surface rolling under open sky.",
            shotType: "extreme_wide",
            cameraAngle: "Eye-level horizon",
            cameraMotion: "Subtle slow drift",
            composition: "Rule-of-thirds ocean horizon dividing sky and open water",
            lighting: "Bright natural daylight",
            colorPreset: "Natural Documentary",
            selectedAssetQuery: "vast ocean surface waves horizon",
            selectionReason: "Captures the vastness of the open ocean before descending below.",
            cutStrategy: "hard_cut",
            transitionDuration: 0.5,
            soundQuery: "ocean surface waves wind ambience",
            soundCategory: "environment",
            soundDuration: 7.0,
            soundLevel: 0.8,
            jCutOffset: 0,
            lCutOffset: 1.0,
            editorialNotes: {
              whyThisShot: "Extreme wide establishes scale and isolates the viewer on the surface before dipping into the deep.",
              whyThisDuration: "5.5 seconds allows the viewer to absorb the massive scale and natural ocean environment.",
              whyThisCut: "A clean hard cut into underwater establishes an abrupt physical threshold transition.",
              whyThisTransition: "Standard cut to maintain raw documentary feel.",
              whyThisSound: "Natural wave sounds ground the viewer in real acoustic reality.",
              whyThisColor: "Natural documentary lighting provides the baseline visual reality before color shifts underwater."
            }
          },
          {
            sceneId: "scene_03",
            duration: 4.5,
            purpose: "Physically move the viewer from known surface world into the underwater threshold.",
            emotion: "Subtle disorientation and curiosity",
            visualGoal: "Bubbles and churning water immediately beneath the ocean surface.",
            shotType: "wide",
            cameraAngle: "Sub-surface downward angle",
            cameraMotion: "Slow fluid descent",
            composition: "Bubbles swirling across vertical frame",
            lighting: "Diffused surface light",
            colorPreset: "Deep Ocean",
            selectedAssetQuery: "underwater surface waves churn blue water",
            selectionReason: "Visually communicates entering the liquid element with churn and water pressure.",
            cutStrategy: "visual_continuity",
            transitionDuration: 0.8,
            soundQuery: "underwater hydrophone submerged ambience",
            soundCategory: "environment",
            soundDuration: 6.5,
            soundLevel: 0.85,
            jCutOffset: -1.0,
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Sub-surface shot physically crosses the liquid boundary between air and water.",
              whyThisDuration: "4.5 seconds captures the violent transition into water before settling into laminar flow.",
              whyThisCut: "Visual continuity matches the fluid downward vector.",
              whyThisTransition: "Fluid dissolve reinforces liquid density.",
              whyThisSound: "Hydrophone audio J-cut introduces muffled submerged acoustics 1.0s before the visual cut.",
              whyThisColor: "Deep ocean cyan highlights the underwater blue spectrum."
            }
          },
          {
            sceneId: "scene_04",
            duration: 5.0,
            purpose: "Reveal sunlight rays piercing down through pristine clear water.",
            emotion: "Serenity and luminous wonder",
            visualGoal: "Shimmering solar rays radiating downward through clear deep blue water.",
            shotType: "wide",
            cameraAngle: "Looking upward toward surface",
            cameraMotion: "Controlled vertical float",
            composition: "Diagonal light beams crossing frame",
            lighting: "Filtered sunbeams in clear water",
            colorPreset: "Deep Ocean",
            selectedAssetQuery: "underwater sunlight rays blue water",
            selectionReason: "Captures celestial light filtering through the top photic zone.",
            cutStrategy: "visual_continuity",
            transitionDuration: 0.8,
            soundQuery: "underwater hydrophone submerged ambience",
            soundCategory: "environment",
            soundDuration: 6.5,
            soundLevel: 0.8,
            jCutOffset: -0.5,
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Looking upward at sunlight through water reinforces the vertical depth beneath us.",
              whyThisDuration: "5.0 seconds creates a serene sensation of drifting beneath the surface.",
              whyThisCut: "Visual continuity cut matches fluid currents.",
              whyThisTransition: "Crossfade blends light streams continuously.",
              whyThisSound: "Submerged acoustic hum cushions the visual tranquility.",
              whyThisColor: "Deep Ocean preset accentuates turquoise highlights along the sunbeams."
            }
          },
          {
            sceneId: "scene_05",
            duration: 5.5,
            purpose: "Convey the loss of solar radiation and the transition into the twilight mesopelagic zone.",
            emotion: "Apprehension and darkening solemnity",
            visualGoal: "Deeper blue waters darkening into shadowy indigo.",
            shotType: "environmental",
            cameraAngle: "Downward angle toward abyss",
            cameraMotion: "Subtle slow push-in",
            composition: "Vignetted darkness closing in from edges",
            lighting: "Dimming twilight underwater",
            colorPreset: "Cold Scientific",
            selectedAssetQuery: "deep blue water abyss dark underwater view",
            selectionReason: "Conveys the rapid extinction of solar light as depth increases past 200 meters.",
            cutStrategy: "crossfade",
            transitionDuration: 1.0,
            soundQuery: "deep sea pressure low frequency rumble",
            soundCategory: "environment",
            soundDuration: 7.5,
            soundLevel: 0.85,
            jCutOffset: -0.8,
            lCutOffset: 0.8,
            editorialNotes: {
              whyThisShot: "Environmental ocean depth shot visually strips away daylight.",
              whyThisDuration: "5.5 seconds gives time for darkness to press into the frame.",
              whyThisCut: "Crossfade smoothly dissolves light into darkness.",
              whyThisTransition: "Gradual crossfade emphasizes descent.",
              whyThisSound: "Low frequency rumble signals increasing physical hydrostatic pressure.",
              whyThisColor: "Cold scientific preset desaturates warm tones to reflect light absorption."
            }
          },
          {
            sceneId: "scene_06",
            duration: 5.5,
            purpose: "Total loss of solar illumination: complete immersion into the midnight abyss.",
            emotion: "Deep isolation and cosmic mystery",
            visualGoal: "Inky midnight blue approaching pure black with minute marine snow drifting.",
            shotType: "environmental",
            cameraAngle: "Free float",
            cameraMotion: "Subtle slow drift",
            composition: "Deep negative space with subtle floating particles",
            lighting: "Zero sunlight, ambient dark indigo",
            colorPreset: "Night",
            selectedAssetQuery: "dark underwater deep abyss midnight zone",
            selectionReason: "Establishes the midnight zone where zero sunlight ever penetrates.",
            cutStrategy: "crossfade",
            transitionDuration: 0.8,
            soundQuery: "deep sea pressure low frequency rumble",
            soundCategory: "environment",
            soundDuration: 7.0,
            soundLevel: 0.9,
            jCutOffset: -0.5,
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Total abyssal darkness challenges the viewer's expectations of underwater life.",
              whyThisDuration: "5.5 seconds allows the audience to feel the overwhelming weight of oceanic void.",
              whyThisCut: "Crossfade maintains continuous sinking sensation.",
              whyThisTransition: "Seamless blend into deep darkness.",
              whyThisSound: "Deep subterranean bass rumble heightens atmospheric tension.",
              whyThisColor: "Night preset crushes blacks to highlight isolation."
            }
          },
          {
            sceneId: "scene_07",
            duration: 5.0,
            purpose: "Reveal that life exists beyond human visibility in total darkness.",
            emotion: "Wonder, astonishment, and proof of life",
            visualGoal: "Macro detail of deep sea bioluminescent organism glowing in pitch black.",
            shotType: "macro_detail",
            cameraAngle: "Close macro level",
            cameraMotion: "Controlled float",
            composition: "Centered glowing organism against pure black negative space",
            lighting: "Self-illuminating organic bioluminescence",
            colorPreset: "Night",
            selectedAssetQuery: "deep sea organism bioluminescent dark water",
            selectionReason: "Directly proves the core thesis: The deep is NOT empty.",
            cutStrategy: "motivated_cut",
            transitionDuration: 0.5,
            soundQuery: "deep water hydrophone subtle organic pulse",
            soundCategory: "environment",
            soundDuration: 6.5,
            soundLevel: 0.8,
            jCutOffset: -0.5,
            lCutOffset: 0.5,
            editorialNotes: {
              whyThisShot: "Macro detail puts the delicate bioluminescent life form in crisp focus.",
              whyThisDuration: "5.0 seconds provides a punchy, surprising reveal of living organisms.",
              whyThisCut: "Motivated cut timed with the organism's luminescent pulse.",
              whyThisTransition: "Quick transition heightens the shock of discovery.",
              whyThisSound: "High frequency hydrophone clicks mimic organic sonar.",
              whyThisColor: "Night preset contrast blacks out background to emphasize luminescent highlights."
            }
          },
          {
            sceneId: "scene_08",
            duration: 6.0,
            purpose: "Show humanity's scientific technology operating against enormous abyssal scale.",
            emotion: "Technical reverence and vast frontier exploration",
            visualGoal: "Submersible ROV lights sweeping across the abyssal floor.",
            shotType: "scientific",
            cameraAngle: "High tracking angle",
            cameraMotion: "Subtle forward tracking pan",
            composition: "ROV in lower third with artificial searchlights scanning floor",
            lighting: "Artificial high-intensity LED searchlights",
            colorPreset: "Cold Scientific",
            selectedAssetQuery: "submersible rov abyssal floor dark water bubbles",
            selectionReason: "Introduces human exploration technology venturing into the deepest frontier.",
            cutStrategy: "hard_cut",
            transitionDuration: 0.8,
            soundQuery: "submersible mechanical hum sonar ping",
            soundCategory: "secondary_effects",
            soundDuration: 8.0,
            soundLevel: 0.85,
            jCutOffset: -1.0,
            lCutOffset: 0.8,
            editorialNotes: {
              whyThisShot: "Scientific tracking shot places technology in contrast with infinite ocean void.",
              whyThisDuration: "6.0 seconds allows the ROV searchlight beam to sweep across the frame.",
              whyThisCut: "Hard cut underscores human mechanical presence.",
              whyThisTransition: "Clean cut reinforces precision instrumentation.",
              whyThisSound: "Mechanical thruster hum and intermittent sonar pings signal deep research.",
              whyThisColor: "Cold scientific preset sharpens metal surfaces and LED searchlight beams."
            }
          },
          {
            sceneId: "scene_09",
            duration: 5.5,
            purpose: "Reveal the untouched abyssal benthic seafloor thousands of meters down.",
            emotion: "Profound silence and alien geology",
            visualGoal: "Wide view of sediment ripples and volcanic rock in artificial lights.",
            shotType: "wide",
            cameraAngle: "Low angle looking across seafloor",
            cameraMotion: "Slow forward glide",
            composition: "Leading lines in seafloor sediment vanishing into darkness",
            lighting: "Submersible light beam falling off into total black",
            colorPreset: "Cold Scientific",
            selectedAssetQuery: "abyssal seafloor sediment rov lights benthic zone",
            selectionReason: "Presents the final geological boundary of the ocean floor.",
            cutStrategy: "fade_to_black",
            transitionDuration: 1.2,
            soundQuery: "deep sea pressure low frequency rumble",
            soundCategory: "environment",
            soundDuration: 7.0,
            soundLevel: 0.8,
            jCutOffset: -0.5,
            lCutOffset: 1.0,
            editorialNotes: {
              whyThisShot: "Wide seafloor perspective grounds the journey at the absolute planetary bottom.",
              whyThisDuration: "5.5 seconds allows appreciation of geological permanence.",
              whyThisCut: "Fade to black ending transition begins here.",
              whyThisTransition: "Slow fade to black marks the journey's resolution.",
              whyThisSound: "Deep seismic rumble returns, grounding the earth.",
              whyThisColor: "Cold scientific grade highlights mineral textures."
            }
          },
          {
            sceneId: "scene_10",
            duration: 3.0,
            purpose: "Final return into pure black quietude for viewer reflection.",
            emotion: "Solemn contemplation and permanence",
            visualGoal: "Pure black screen slug holding in total peace.",
            shotType: "environmental",
            cameraAngle: "Neutral void",
            cameraMotion: "none",
            composition: "Centering black space",
            lighting: "Zero luminance",
            colorPreset: "Neutral",
            selectedAssetQuery: "black screen void darkness slug",
            selectionReason: "Concludes the documentary journey in the quiet darkness of the deep.",
            cutStrategy: "fade_to_black",
            transitionDuration: 1.0,
            soundCategory: "silence",
            soundDuration: 3.0,
            soundLevel: 0.0,
            jCutOffset: 0,
            lCutOffset: 0,
            editorialNotes: {
              whyThisShot: "Final black frame lets the narrative thesis resonate in the mind.",
              whyThisDuration: "3.0 seconds provides a dignified conclusion.",
              whyThisCut: "Ending fade into silence.",
              whyThisTransition: "Gentle closure.",
              whyThisSound: "Final silence underscores the vast quietude of the deep.",
              whyThisColor: "Absolute black leaves the viewer in reverent contemplation."
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
      estimatedDuration: 45,
      storyArc: "Introduction -> Exploration -> Revelation -> Resolution",
      visualLanguage: "High contrast cinematic documentary framing with intentional lighting and movement.",
      colorLanguage: "Natural tones with subtle color balance.",
      editingStyle: "Pacing driven by story progression.",
      pacing: "Balanced documentary rhythm.",
      soundLanguage: "Environmental soundscapes and natural acoustics.",
      scenes: [
        {
          sceneId: "scene_01",
          duration: 3.0,
          purpose: "Establish subject context and mood in silence.",
          emotion: "Anticipation",
          visualGoal: "Introductory black title card slug.",
          shotType: "environmental",
          cameraAngle: "Neutral void",
          cameraMotion: "none",
          composition: "Center black frame",
          lighting: "Zero luminance",
          colorPreset: "Neutral",
          selectedAssetQuery: "black screen slug",
          selectionReason: "Establishes narrative quietude.",
          cutStrategy: "fade_to_black",
          transitionDuration: 0.8,
          soundCategory: "silence",
          soundDuration: 3.0,
          soundLevel: 0.0,
          jCutOffset: 0,
          lCutOffset: 0,
          editorialNotes: {
            whyThisShot: "Establishes mood in silence.",
            whyThisDuration: "Allows focus before motion.",
            whyThisCut: "Fade up into main scene.",
            whyThisTransition: "Smooth entry.",
            whyThisSound: "Silence resets acoustic palette.",
            whyThisColor: "Neutral baseline."
          }
        },
        {
          sceneId: "scene_02",
          duration: 7.0,
          purpose: "Establish main subject environment.",
          emotion: "Curiosity and wonder",
          visualGoal: "Expansive wide establishing view.",
          shotType: "extreme_wide",
          cameraAngle: "Eye level",
          cameraMotion: "Subtle pan",
          composition: "Balanced landscape",
          lighting: "Natural daylight",
          colorPreset: "Natural Documentary",
          selectedAssetQuery: prompt,
          selectionReason: "Establishes geographical context.",
          cutStrategy: "hard_cut",
          transitionDuration: 0.5,
          soundQuery: "environmental atmosphere",
          soundCategory: "environment",
          soundDuration: 8.5,
          soundLevel: 0.8,
          jCutOffset: 0,
          lCutOffset: 0.5,
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
