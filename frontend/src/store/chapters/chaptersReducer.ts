import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList";

const initialState: onlineListInitialState = {
  items: [],
  currentId: null
}

export const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<onlineListDefaultItem[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    setCurrent(state, action: PayloadAction<onlineListDefaultItem['id']>) {
      if (state.currentId !== action.payload) {
        state.currentId = action.payload
      }
    }
  }
})

export default chaptersSlice.reducer