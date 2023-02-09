import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList";

export type BookItem = onlineListDefaultItem & {
  part: string | null
}

const initialState: onlineListInitialState<BookItem> = {
  items: [],
  currentId: null
}

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<BookItem[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    setCurrent(state, action: PayloadAction<BookItem['id']>) {
      if (state.currentId !== action.payload) state.currentId = action.payload
    }
  }
})

export default booksSlice.reducer