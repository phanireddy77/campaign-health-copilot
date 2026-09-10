import { configureStore } from "@reduxjs/toolkit";

import advertiserReducer from "../features/advertisers/advertiserSlice";
import campaignReducer from "../features/campaigns/campaignSlice";
import lineReducer from "../features/lines/lineSlice";
import metricsReducer from "../features/lines/metricsSlice";
import healthReducer from "../features/lines/lineHealthSlice";
import campaignHealthReducer from "../features/campaigns/campaignHealthSlice";
import campaignAnalysisReducer from "../features/campaigns/campaignAnalysis";

export const store = configureStore({
    reducer: {
        advertisers: advertiserReducer,
        campaigns: campaignReducer,
        lines: lineReducer,
        metrics: metricsReducer,
        lineHealth: healthReducer,
        campaignHealth: campaignHealthReducer,
        campaignAnalysis: campaignAnalysisReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;