import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "../../api/apiClient";
import type { CampaignHealthResult } from "../../types/campaignHealth";
import type { Campaign } from "../../types/domain";

interface CampaignHealthResponse {
    campaign: Campaign;
    health: CampaignHealthResult;
}

interface CampaignHealthState {
    result: CampaignHealthResult | null;
    loading: boolean;
    error: string;
}

const initialState: CampaignHealthState = {
    result: null,
    loading: false,
    error: ''
};

export const fetchCampaignHealth = createAsyncThunk(
    "campaigns/fetchCampaignHealth",
    async (campaignId: number) => {
      return apiGet<CampaignHealthResponse>(
        `/campaigns/${campaignId}/health`
      );
    }
);

const campaignHealthSlice = createSlice({
    name: "campaignHealth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchCampaignHealth.pending,
            (state) => {
                state.error = '';
                state.loading = true;
            }
        )
        .addCase(
            fetchCampaignHealth.fulfilled,
            (state, action) => {
                state.result = action.payload.health;
                state.error = '';
                state.loading = true;
            }
        )
        .addCase(
            fetchCampaignHealth.rejected,
            (state, action) => {
                state.error = action.error.message || 'Failed to retrieve campaign health';
                state.loading = false;
            }
        )
    }
});

export default campaignHealthSlice.reducer;