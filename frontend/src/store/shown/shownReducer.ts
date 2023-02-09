import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StateRow } from "../../types/supabase-extended";

interface stateInitialState {
  currentVerseId: StateRow['verse_id'] | null,
  currentCoupletId: StateRow['couplet_id'] | null
}

const initialState: stateInitialState = {
  currentVerseId: null,
  currentCoupletId: null
}

export const shownSlice = createSlice({
  name: 'shown',
  initialState,
  reducers: {
    setVerseId(state, action: PayloadAction<StateRow['verse_id']>) {
      state.currentVerseId = action.payload
    },
    setCoupletId(state, action: PayloadAction<StateRow['couplet_id']>) {
      state.currentCoupletId = action.payload
    },
  }
})

export default shownSlice.reducer