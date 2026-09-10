export type AnalysisSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type ConfidenceLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface PrimaryConcern {
  title: string;

  severity: AnalysisSeverity;

  evidence: string;
}

export interface LikelyCause {
  cause: string;

  confidence: ConfidenceLevel;

  reasoning: string;
}

export interface CampaignAnalysis {
  executiveSummary: string;

  primaryConcerns:
    PrimaryConcern[];

  likelyCauses:
    LikelyCause[];

  recommendedChecks:
    string[];

  recommendedActions:
    string[];
}