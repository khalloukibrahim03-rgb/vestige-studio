export interface TimingEvaluation {
  suggestedMinDuration: number;
  suggestedMaxDuration: number;
  pacingCategory: "slow_contemplative" | "moderate_narrative" | "fast_dynamic";
}

/**
 * Calculates dynamic shot duration guidance based on shot classification and narrative weight.
 */
export function evaluateShotTiming(shotType: string, purpose: string): TimingEvaluation {
  const isWideOrAtmospheric = ["extreme_wide", "wide", "aerial", "environmental"].includes(shotType);
  const isDetailOrTension = ["close_up", "macro_detail", "scientific"].includes(shotType);

  if (isWideOrAtmospheric) {
    return {
      suggestedMinDuration: 5.0,
      suggestedMaxDuration: 8.0,
      pacingCategory: "slow_contemplative",
    };
  }

  if (isDetailOrTension) {
    return {
      suggestedMinDuration: 3.5,
      suggestedMaxDuration: 5.5,
      pacingCategory: "fast_dynamic",
    };
  }

  return {
    suggestedMinDuration: 4.0,
    suggestedMaxDuration: 6.5,
    pacingCategory: "moderate_narrative",
  };
}
