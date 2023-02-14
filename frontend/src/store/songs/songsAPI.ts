import { AppDispatch } from ".."
import { supabase } from "../../supabase"
import { Database } from "../../types/supabase"
import { DBTables } from "../../types/supabase-extended"
import { setCouplets } from "../couplets/coupletsAPI"
import { Song, songsSlice } from "./songsReducer"

export const setSongs = (
  songs: Database['public']['Tables']['Song']['Row'][]
) => async (dispatch: AppDispatch) => {
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
  await dispatch(setCurrentSong(normalizedSongs[0].id))
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