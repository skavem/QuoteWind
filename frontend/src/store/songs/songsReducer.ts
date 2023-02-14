import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { onlineListInitialState, onlineListDefaultItem } from "../../types/onlineList"

export type Song = onlineListDefaultItem & Required<Pick<onlineListDefaultItem, 'mark'>>

export const currentSongLocalStorageName = 'Redux_song_current'
const currentSongFromLocalStorage = JSON.parse(
  String(localStorage.getItem(currentSongLocalStorageName))
) as Song['id']

const initialState: onlineListInitialState<Song> = {
  items: [],
  currentId: currentSongFromLocalStorage
}

export const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Song[]>) {
      if (state.items !== action.payload) state.items = action.payload
    },
    setCurrent(state, action: PayloadAction<Song['id']>) {
      if (state.currentId !== action.payload) state.currentId = action.payload
    },
    updateItem(state, action: PayloadAction<Song>) {
      const itemIndex = state.items.findIndex(item => item.id === action.payload.id)
      state.items[itemIndex] = action.payload
    },
    addItem(state, action: PayloadAction<Song>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<Song['id']>) {
      state.items = state.items.filter(item => item.id !== action.payload)
    }
  }
})

export default songsSlice.reducer