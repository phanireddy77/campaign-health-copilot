import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "../../api/apiClient";
import type { Campaign, Line } from "../../types/domain";

interface CampaignLineResponse {
    campaign: Campaign;
    lines: Line[];
};

interface LineState {
    items: Line[];
    selected: Line | null;
    loading: boolean;
    error: string;
};

const initialState: LineState = {
    items: [],
    selected: null,
    loading: false,
    error: ''
};

export const fetchLinesByCampaign = createAsyncThunk(
    "lines/fetchLinesByCampaign",
    async (campaignId: number) => {
        return apiGet<CampaignLineResponse>(`/campaigns/${campaignId}/lines`);
    }
);

export const fetchLineById = createAsyncThunk(
    "lines/fetchLineById",
    async (lineId: number) => {
        return apiGet<Line>(`/lines/${lineId}`);
    }
);

const lineSlice = createSlice({
    name: "lines",
    initialState,
    reducers: {},
    extraReducers: (build) => {
        build
        .addCase(
            fetchLinesByCampaign.pending,
            (state) => {
                state.loading = true;
                state.error = '';
            }
        )
        .addCase(
            fetchLinesByCampaign.fulfilled,
            (state,action) => {
                state.loading = false;
                state.error = '';
                state.items = action.payload.lines;
            }
        )
        .addCase(
            fetchLinesByCampaign.rejected,
            (state,action) => {
                state.loading = false;
                state.error = action.error.message || "Falied to load lines";
            }
            
        )
        .addCase(
            fetchLineById.fulfilled,
            (state,action) => {
                state.loading = false;
                state.error = '';
                state.selected = action.payload;
            }
        )
        
    }
});
export default lineSlice.reducer;