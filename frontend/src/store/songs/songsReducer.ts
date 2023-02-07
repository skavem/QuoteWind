import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList"

const initialState: onlineListInitialState = {
  items: [],
  currentId: null
}

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<onlineListDefaultItem[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    setCurrent(state, action: PayloadAction<onlineListDefaultItem['id']>) {
      if (state.currentId !== action.payload) state.currentId = action.payload
    },
    updateItem(state, action: PayloadAction<onlineListDefaultItem>) {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id)
      state.items[itemIndex] = action.payload
    },
    addItem(state, action: PayloadAction<onlineListDefaultItem>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<onlineListDefaultItem['id']>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    }
  }
})

export default songsSlice.reducer