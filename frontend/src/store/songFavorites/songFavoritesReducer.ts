import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList";
import { DBTables } from "../../types/supabase";

export type SongFavorite = onlineListDefaultItem & {
  songId: DBTables['Song']['Row']['id']
}

export const songFavoritesLocalStorageName = 'Redux_song_favorites'
const favsFromLocalStorage = JSON.parse(
  localStorage.getItem(songFavoritesLocalStorageName) ?? '[]'
) as SongFavorite[]

const initialState: onlineListInitialState<SongFavorite> = {
  items: favsFromLocalStorage,
  currentId: null
}

export const songFavoritesSlice = createSlice({
  name: 'songFavorites',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<SongFavorite[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    addItem(state, action: PayloadAction<SongFavorite>) {
      state.items = [...state.items, action.payload]
    },
    removeItem(state, action: PayloadAction<SongFavorite>) {
      state.items = state.items.filter(item => item.id !== action.payload.id)
    }
  }
})

export default songFavoritesSlice.reducer