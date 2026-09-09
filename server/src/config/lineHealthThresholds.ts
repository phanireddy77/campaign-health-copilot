export const HEALTH_THRESHOLDS = {
    underPacingRatio: 0.75,
    overPacingRatio: 1.20,
    minimumCtr: 0.005,
    highCpaMultiplier: 1.25,
    noConversionMinimumSpend: 500
} as const;

export const HEALTH_PENALTIES = {
    UNDER_PACING: 20,
    OVER_PACING: 15,
    LOW_CTR: 15,
    HIGH_CPA: 15,
    NO_CONVERSIONS: 40
} as const;

export const HEALTH_SCORE_THRESHOLDS = {
    HEALTHY: 90,
    WARNING: 60
} as const;