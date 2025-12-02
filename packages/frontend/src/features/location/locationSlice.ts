import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "./locationTypes";

interface LocationState {
  location: Location | null;
}


const initialState: LocationState = {
  location: null
};


const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    clearLocation: (state) => {
      state.location = null;
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export const currentLocation = (state: { location: LocationState }) => state.location.location;
export default locationSlice.reducer;
