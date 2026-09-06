import { createAsyncThunk, createSlice  } from "@reduxjs/toolkit";
import type { Advertiser } from "../../types/domain";
import { apiGet } from "../../api/apiClient";

interface AdvertiserState {
    items: Advertiser[],
    loading: boolean,
    error: string | ''
};

const initialState: AdvertiserState = {
    items: [],
    loading: false,
    error: ''
};

export const fetchAdvertisers =
  createAsyncThunk(
    "advertisers/fetchAdvertisers",
    async () => {
      return apiGet<Advertiser[]>(
        "/advertisers"
      );
    }
  );

const advertiserSlice = createSlice({
    name: 'advertisers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(
            fetchAdvertisers.pending,
            (state) => {
                state.loading = true;
                state.error = '';
            }
        )
        .addCase(
            fetchAdvertisers.fulfilled,
            (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.error = '';
            }
        )
        .addCase(
            fetchAdvertisers.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load advertisers';
            }
        )
    }
});

export default advertiserSlice.reducer;