import {
  openai,
  OPENAI_MODEL,
} from "../config/openai.js";

import { env } from "../config/env";

import { AppError } from "../errors/AppError";

import {
  getCampaignHealth,
} from "./campaignHealthService.js";

import {
  buildCampaignAnalysisInput,
} from "../ai/buildCampaignAnalysisInput.js";

import {
  CAMPAIGN_ANALYSIS_INSTRUCTIONS,
} from "../ai/campaignAnalysisPrompt.js";

import {
  campaignAnalysisSchema,
} from "../ai/campaignAnalysisSchema.js";

import type {
  CampaignAnalysis,
} from "../types/analysis.js";

export async function analyzeCampaign(
  campaignId: number
) {
  if (!env.OPENAI_API_KEY) {
    throw new AppError(503, "AI_NOT_CONFIGURED", "AI analysis is not configured.");
  }

  const campaignHealthResult =
    await getCampaignHealth(
      campaignId
    );

  if (!campaignHealthResult) {
    return null;
  }

  const {
    campaign,
    health,
  } = campaignHealthResult;

  const input =
    buildCampaignAnalysisInput({
      campaign,
      health,
    });
    let response;
    
    try {
      response =
        await openai.responses.create({
          model:
            OPENAI_MODEL,

          instructions:
            CAMPAIGN_ANALYSIS_INSTRUCTIONS,

          input: [
            {
              role: "user",

              content: [
                {
                  type: "input_text",

                  text:
                    `Analyze this campaign health JSON:\n${JSON.stringify(
                      input
                    )}`,
                },
              ],
            },
          ],

          text: {
            format: {
              type: "json_schema",

              name:
                "campaign_health_analysis",

              strict: true,

              schema:
                campaignAnalysisSchema,
            },
          },
        });
    } catch(error) {
        console.error(
        "OpenAI request failed:",
        error
      );

      throw new AppError(
        502,
        "AI_ANALYSIS_FAILED",
        "Campaign AI analysis could not be completed."
      );
    }

  
  console.log(response.output_text);

  const analysis =
    JSON.parse(
      response.output_text
    ) as CampaignAnalysis;

  return {
    campaignId:
      campaign.id,

    model:
      OPENAI_MODEL,

    analysis,

    generatedAt: new Date().toISOString(),

    healthSnapshot: {
      score: health.score,
      status: health.status
    }
  };
}