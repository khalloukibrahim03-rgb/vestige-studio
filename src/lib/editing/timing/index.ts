export interface PacingGuide {
  recommendedDuration: number;
  reason: string;
}

export function calculateDynamicPacing(
  shotType: string,
  scenePurpose: string
): PacingGuide {
  const isScale = shotType.includes("wide") || shotType.includes("aerial") || scenePurpose.toLowerCase().includes("scale");
  const isDetail = shotType.includes("macro") || shotType.includes("close") || scenePurpose.toLowerCase().includes("discovery");

  if (isScale) {
    return {
      recommendedDuration: 6.5,
      reason: "Longer duration allows the audience to absorb scale, atmosphere, and visual context.",
    };
  }

  if (isDetail) {
    return {
      recommendedDuration: 4.2,
      reason: "Focused detail shot builds curiosity and visual tension with dynamic rhythm.",
    };
  }

  return {
    recommendedDuration: 5.5,
    reason: "Standard documentary scene pacing balance.",
  };
}
