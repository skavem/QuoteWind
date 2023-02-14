import { AppDispatch, onlineListStores, RootState } from ".."
import { supabase } from "../../supabase"
import { Database } from "../../types/supabase"
import { DBTables } from "../../types/supabase-extended"
import { setCouplets } from "../couplets/coupletsAPI"
import { currentSongLocalStorageName, Song, songsSlice } from "./songsReducer"

const setCurrentSongToLocalStorage = (currentSongId: Song['id']) => {
  localStorage.setItem(currentSongLocalStorageName, String(currentSongId))
}

export const setSongs = (
  songs: Database['public']['Tables']['Song']['Row'][]
) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const normalizedSongs = songs
  .map<Song>(song => ({
    id: song.id,
    data: song.name,
    mark: song.label
  }))
  .sort((song1, song2) => {
    const song1Mark = song1.mark ? +song1.mark : 0
    const song2Mark = song2.mark ? +song2.mark : 0
    return song1Mark - song2Mark
  })
  dispatch(songsSlice.actions.setItems(normalizedSongs))

  const currentId = getState()[onlineListStores.songs].currentId
  if (!currentId) {
    await dispatch(setCurrentSong(normalizedSongs[0].id))
  } else {
    await dispatch(setCurrentSong(
      currentId,
      getState()[onlineListStores.couplets].currentId
    ))
  }
}

export const setCurrentSong = (
  songId: Song['id'],
  coupletId: Song['id'] | null = null
) => async (dispatch: AppDispatch) => {
  dispatch(songsSlice.actions.setCurrent(songId))
  const { data: couplets } = await supabase
    .from('Couplet')
    .select()
    .eq('song_id', songId)
  if (couplets) {
    await dispatch(setCouplets(couplets, coupletId))
  }
  setCurrentSongToLocalStorage(songId)
}

export const updateSong = (
  song: Database['public']['Tables']['Song']['Row']
) => async (dispatch: AppDispatch) => {
  dispatch(songsSlice.actions.updateItem({
    id: song.id,
    data: song.name,
    mark: song.label
  }))
}

export const addSong = (
  song: DBTables['Song']['Row']
) => async (dispatch: AppDispatch) => {
  dispatch(songsSlice.actions.addItem({
    id: song.id,
    data: song.name,
    mark: song.label
  }))
}

export const deleteSong = (
  songId: DBTables['Song']['Row']['id']
) => async (dispatch: AppDispatch) => {
  dispatch(songsSlice.actions.removeItem(songId))
}