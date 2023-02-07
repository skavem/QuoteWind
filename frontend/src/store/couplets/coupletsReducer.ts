import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList";

export type Couplet = onlineListDefaultItem 

const initialState: onlineListInitialState<Couplet> = {
  items: [],
  currentId: null
}

export const coupletsSlice = createSlice({
  name: 'couplets',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Couplet[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    setCurrent(state, action: PayloadAction<Couplet['id']>) {
      if (state.currentId !== action.payload) state.currentId = action.payload
    },
    deleteItem(state, action: PayloadAction<Couplet['id']>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    updateItem(state, action: PayloadAction<Couplet>) {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id)
      state.items[itemIndex] = action.payload
    }
  }
})

export default coupletsSlice.reducer