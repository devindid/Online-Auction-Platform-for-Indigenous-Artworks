import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bidService from "./bidService";

export const placeABid = createAsyncThunk(
  "bid/placeABid",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bidService.placeABid(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBidsAuctionsByUser = createAsyncThunk(
  "bids/getBidsAuctionsByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidService.getBidsAuctionsByUser();
      return response && response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBidsAuctionsWinnersParticipatedByUser = createAsyncThunk(
  "bids/getBidsAuctionsWinnersParticipatedByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidService.getBidsAuctionsWinnersParticipatedByUser();
      if(response && response.data){
        let data = response.data;
        console.log(data, "======== data");
        return data.filter((item) => {
          console.log(item?.auction?.winner, "item?.auction?.winner?.isWinningBid");
          return item?.auction?.winner?._id === item?._id;
        });
      }
    
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserWinnings = createAsyncThunk(
  "bids/getUserWinnings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bidService.getUserWinnings();
      if(response && response.data){
        let data = response.data;
        console.log(data, "======== data");
        return data.filter((item) => {
          console.log(item?.auction?.winner, "item?.auction?.winner?.isWinningBid");
          return item?.auction?.winner?.bidder?._id === item?.bidder && item?.auction?.winner?._id === item?._id;
        });
      }
    
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const getAllBidsForAuction = createAsyncThunk(
  "bids/getAllBidsForAuction",
  async (id,{rejectWithValue}) => {
    try {
      const response = await bidService.getAllBidsForAuction(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  bids: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeABid.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(placeABid.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    });
    builder.addCase(placeABid.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    });
    
    builder.addCase(getBidsAuctionsByUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getBidsAuctionsByUser.fulfilled, (state, action) => {
      console.log("action.payload.data", action.payload);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.bids = action.payload;
    });
    builder.addCase(getBidsAuctionsByUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    });
    builder.addCase(getUserWinnings.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getUserWinnings.fulfilled, (state, action) => {
      console.log("action.payload.data", action.payload);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.bids = action.payload;
    });
    builder.addCase(getUserWinnings.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    });

    builder.addCase(getBidsAuctionsWinnersParticipatedByUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getBidsAuctionsWinnersParticipatedByUser.fulfilled, (state, action) => {
      console.log("action.payload.data", action.payload);
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.bids = action.payload;
    });
    builder.addCase(getBidsAuctionsWinnersParticipatedByUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    });
    builder.addCase(getAllBidsForAuction.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getAllBidsForAuction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = true;
      state.bids = action.payload.bids;
    });
    builder.addCase(getAllBidsForAuction.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload.message;
    });
  },
});

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
