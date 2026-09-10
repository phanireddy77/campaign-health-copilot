import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiPost } from "../../api/apiClient";
import type { CampaignAnalysis } from "../../types/analysis";

interface CampaignAnalysisResponse {
    campaignId: number;
    model: string;
    analysis: CampaignAnalysis;
}

interface CampaignAnalysisState {
    model: string | '';
    result: CampaignAnalysis | null;
    loading: boolean;
    error: string | '';
}

const initialState: CampaignAnalysisState = {
    model: '',
    result: null,
    loading: false,
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
              state.loading =
                false;

              state.result =
                action.payload.analysis;

              state.model =
                action.payload.model;
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
