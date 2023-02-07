import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList";
import { Database } from "../../types/supabase";

export type historyItem = onlineListDefaultItem & {
  bookId: Database['public']['Tables']['Book']['Row']['id'],
  chapterId: Database['public']['Tables']['Chapter']['Row']['id'],
  verseId: Database['public']['Tables']['Verse']['Row']['id'],
}

const initialState: onlineListInitialState<historyItem> = {
  items: [],
  currentId: null
}

export const verseHistorySlice = createSlice({
  name: 'verseHistory',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<historyItem>) {
      state.items = [action.payload, ...state.items]
    },
    setItems(state, action: PayloadAction<historyItem[]>) {
      state.items = action.payload
    },
    removeItem(state, action: PayloadAction<historyItem>) {
      state.items = state.items.filter(item => item.id !== action.payload.id)
    }
  }
})

export default verseHistorySlice.reducer