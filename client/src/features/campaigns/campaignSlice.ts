import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Advertiser, Campaign } from "../../types/domain";
import { apiGet } from "../../api/apiClient";

interface AdvertiserCampaignResponse {
  advertiser: Advertiser;
  campaigns: Campaign[];
}

interface CampaignState {
    advertiser: Advertiser | null;
    items: Campaign[];
    selected: Campaign | null;
    loading: boolean;
    error: string;
}

const initialState: CampaignState = {
    advertiser: null,
    items: [],
    selected: null,
    loading: false,
    error: ''
}

export const fetchCampaignsByAdvertiser = createAsyncThunk(
    "campaigns/fetchCampaignsByAdvertiser",
    async (advertiserId: number) => {
        return apiGet<AdvertiserCampaignResponse>(`/advertisers/${advertiserId}/campaigns`);
    }
);

export const fetchCampaignById = createAsyncThunk(
    "campaigns/fetchById",
    async (campaignId: number) => {
        return apiGet<Campaign>(`/campaigns/${campaignId}`);
        }
);

const campaignSlice = createSlice({
    name: "campaigns",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchCampaignsByAdvertiser.pending,
            (state) => {
                state.loading = true;
                state.error = '';
            }
        )
        .addCase(
            fetchCampaignsByAdvertiser.fulfilled,
            (state,action) => {
                state.loading = false;
                state.error = '';
                state.advertiser = action.payload.advertiser;
                state.items = action.payload.campaigns;
            }
        )
        .addCase(
            fetchCampaignsByAdvertiser.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Falied to load campaigns";
            }
        )
        .addCase(
            fetchCampaignById.fulfilled,
            (state,action) => {
                state.error = '';
                state.loading = false;
                state.selected = action.payload;
            }
        )
    }
});

export default campaignSlice.reducer;