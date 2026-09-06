import { configureStore } from "@reduxjs/toolkit";

import advertiserReducer from "../features/advertisers/advertiserSlice";
import campaignReducer from "../features/campaigns/campaignSlice";
import lineReducer from "../features/lines/lineSlice";


export const store = configureStore({
    reducer: {
        advertisers: advertiserReducer,
        campaigns: campaignReducer,
        lines: lineReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;