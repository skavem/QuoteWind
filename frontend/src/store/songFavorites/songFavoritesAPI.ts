import { AppDispatch, onlineListStores, RootState } from "..";
import { onlineListDefaultItem } from "../../types/onlineList";
import { SongFavorite, songFavoritesLocalStorageName, songFavoritesSlice } from "./songFavoritesReducer";

const setCurrentSongFavsToLocalStorage = (state: RootState) => {
  const favs = state[onlineListStores.songFavorites].items
  localStorage.setItem(songFavoritesLocalStorageName, JSON.stringify(favs))
}

export const addSongsFav = (
  song: onlineListDefaultItem
) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const songFavorite: SongFavorite = {...song, id: Math.random(), songId: song.id}
  dispatch(songFavoritesSlice.actions.addItem(songFavorite))
  setCurrentSongFavsToLocalStorage(getState())
}

export const setCurrentSongsFav = (
  song: SongFavorite
) => async (dispatch: AppDispatch) => {
  dispatch(songFavoritesSlice.actions.setCurrent(song))
}

export const removeSongsFav = (
  songFav: SongFavorite
) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(songFavoritesSlice.actions.removeItem(songFav))
  setCurrentSongFavsToLocalStorage(getState())
}

export const clearSongsFavs = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  dispatch(songFavoritesSlice.actions.setItems([]))
  setCurrentSongFavsToLocalStorage(getState())
} 