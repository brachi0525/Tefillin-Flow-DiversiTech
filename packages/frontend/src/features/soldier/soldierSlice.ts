import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Soldier, SoldierStatus } from "./soldierTypes";


interface SoldierState {
  soldier: Soldier | null;
  selectedSoldier: Soldier | null;
  isDetailsPanelOpen: boolean;
}
const initialState: SoldierState = {
  soldier: process.env.NODE_ENV === 'test' ? null : null,
  selectedSoldier: null,
  isDetailsPanelOpen: false,
};


const soldierSlice = createSlice({
  name: "soldier",
  initialState,
  reducers: {
    setSoldier: (state, action: PayloadAction<Soldier>) => {
      state.soldier = action.payload;
    },
    clearSoldier: (state) => {
      state.soldier = null;
    },
    setSelectedSoldier: (state, action: PayloadAction<Soldier>) => {
      state.selectedSoldier = action.payload;
      state.isDetailsPanelOpen = true;
          },
    clearSelectedSoldier: (state) => {
      state.selectedSoldier = null;
      state.isDetailsPanelOpen = false;
    },
    toggleDetailsPanel: (state) => {
      state.isDetailsPanelOpen = !state.isDetailsPanelOpen;
    }
  },
});

export const { 
  setSoldier, 
  clearSoldier, 
  setSelectedSoldier, 
  clearSelectedSoldier, 
  toggleDetailsPanel 
} = soldierSlice.actions;

export const currentSoldier = (state: { soldier: SoldierState }) => state.soldier.soldier;
export const selectedSoldier = (state: { soldier: SoldierState }) => state.soldier.selectedSoldier;
export const isDetailsPanelOpen = (state: { soldier: SoldierState }) => state.soldier.isDetailsPanelOpen;

export default soldierSlice.reducer;