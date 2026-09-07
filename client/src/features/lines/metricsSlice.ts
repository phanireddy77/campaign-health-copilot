import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiGet } from "../../api/apiClient";
import type { Line, LineMetric, LinePerformanceSummary } from "../../types/domain";

interface LineMetricsResponse {
    line: Line,
    summary: LinePerformanceSummary,
    metrics: LineMetric[]
};

interface MetricsState {
  summary: LinePerformanceSummary | null;
  daily: LineMetric[];

  loading: boolean;
  error: string | '';
};

const initialState: MetricsState = {
    summary: null,
    daily: [],
    loading: false,
    error: ''
};

export const fetchLineMetrics = createAsyncThunk(
    "lines/fetchMetrics",
    async ( lineId: number) => {
        return apiGet<LineMetricsResponse>(`/lines/${lineId}/metrics`);
    }
);

const metricsSlice = createSlice({
    name: "metrics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchLineMetrics.pending,
            (state) => {
                state.loading = true;
                state.error = '';
            }
        )
        .addCase(
            fetchLineMetrics.fulfilled,
            (state, action) => {
                state.daily = action.payload.metrics;
                state.summary = action.payload.summary;
                state.error = '';
                state.loading = false;
            }
        )
        .addCase(
            fetchLineMetrics.rejected,
            (state,action) => {
                state.error = action.error.message || 'Failed to load metrics';
                state.loading = false;
            }
        )
    }
});

export default metricsSlice.reducer;