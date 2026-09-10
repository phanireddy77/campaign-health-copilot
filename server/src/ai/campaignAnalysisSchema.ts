export const campaignAnalysisSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    executiveSummary: {
      type: "string",
    },

    primaryConcerns: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        properties: {
          title: {
            type: "string",
          },

          severity: {
            type: "string",
            enum: [
              "LOW",
              "MEDIUM",
              "HIGH",
            ],
          },

          evidence: {
            type: "string",
          },
        },

        required: [
          "title",
          "severity",
          "evidence",
        ],
      },
    },

    likelyCauses: {
      type: "array",

      items: {
        type: "object",

        additionalProperties: false,

        properties: {
          cause: {
            type: "string",
          },

          confidence: {
            type: "string",
            enum: [
              "LOW",
              "MEDIUM",
              "HIGH",
            ],
          },

          reasoning: {
            type: "string",
          },
        },

        required: [
          "cause",
          "confidence",
          "reasoning",
        ],
      },
    },

    recommendedChecks: {
      type: "array",

      items: {
        type: "string",
      },
    },

    recommendedActions: {
      type: "array",

      items: {
        type: "string",
      },
    },
  },

  required: [
    "executiveSummary",
    "primaryConcerns",
    "likelyCauses",
    "recommendedChecks",
    "recommendedActions",
  ],
} as const;