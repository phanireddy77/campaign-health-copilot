import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiPost } from "../../api/apiClient";
import type { CampaignAnalysis } from "../../types/analysis";
import type { HealthStatus } from "../../types/lineHealth";

interface CampaignAnalysisResponse {
    campaignId: number;
    model: string;
    analysis: CampaignAnalysis;
    generatedAt: string;
    healthSnapshot: {
      score: number;
      status: HealthStatus | null;
    };
}

interface CampaignAnalysisState {
    model: string | '';
    result: CampaignAnalysis | null;
    generatedAt: string | '';
    healthSnapshot: {
      score: number;
      status: HealthStatus | null;
    } | null;
    loading: boolean;
    error: string | '';
}

const initialState: CampaignAnalysisState = {
    model: '',
    result: null,
    loading: false,
    generatedAt: '',
    healthSnapshot: null,
    error: ''
};

export const analyzeCampaign =
  createAsyncThunk(
    "campaignAnalysis/analyze",

    async (
      campaignId: number
    ) => {
      return apiPost<
        CampaignAnalysisResponse
      >(
        `/campaigns/${campaignId}/analyze`
      );
    }
  );

  const campaignAnalysisSlice = createSlice({
    name: "campaignAnalysis",
    initialState,
    reducers: {
        clearAnalysis:
            (state) => {
                state.result = null;
                state.model = '';
                state.error = '';
                state.generatedAt = '';
                state.healthSnapshot = null;
            },
        },
    extraReducers:
      (builder) => {
        builder

          .addCase(
            analyzeCampaign.pending,
            (state) => {
              state.loading =
                true;

              state.error =
                '';
            }
          )

          .addCase(
            analyzeCampaign.fulfilled,
            (
              state,
              action
            ) => {
              const { analysis, model, generatedAt, healthSnapshot } = action.payload;

              state.loading = false;
              state.result = analysis;
              state.model = model;
              state.generatedAt = generatedAt;
              state.healthSnapshot = healthSnapshot;
            }
          )

          .addCase(
            analyzeCampaign.rejected,
            (
              state,
              action
            ) => {
              state.loading =
                false;

              state.error =
                action.error.message ||
                "AI analysis failed";
            }
          );
      },
  });
  
  export const { clearAnalysis } = campaignAnalysisSlice.actions;
  export default campaignAnalysisSlice.reducer;
