import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "../../api/apiClient";
import type { Line, LinePerformanceSummary } from "../../types/domain";
import type { LineHealthResult } from "../../types/lineHealth";

interface LineHealthResponse {
    line: Line;
    performanceSummary: LinePerformanceSummary;
    health: LineHealthResult;
};

interface HealthState {
    result: LineHealthResult | null;
    loading: boolean;
    error: string | '';
};

const initialState: HealthState = {
    result: null,
    loading: false,
    error: ''
};

export const fetchLineHealth = createAsyncThunk(
    "lines/fetchLineHealth",
    async (lineId: number) => {
        return apiGet<LineHealthResponse>(`/lines/${lineId}/health`);
    }
);

const lineHealthSlice = createSlice({
    name: "lineHealth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchLineHealth.pending,
            (state) => {
                state.loading = true;
                state.error = '';
            }
        )
        .addCase(
            fetchLineHealth.fulfilled,
            (state,action) => {
                state.result = action.payload.health;
                state.error = '';
                state.loading = false;
            }
        )
        .addCase(
            fetchLineHealth.rejected,
            (state,action) => {
                state.error = action.error.message || 'Failed to retrieve line health';
                state.loading = false;
            }
        )
    }
});

export default lineHealthSlice.reducer;