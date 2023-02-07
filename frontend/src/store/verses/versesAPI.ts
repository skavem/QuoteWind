import { AppDispatch, onlineListStores, RootState } from ".."
import { Database } from "../../types/supabase"
import { versesSlice } from "./versesReducer"
import { onlineListDefaultItem } from "../../types/onlineList";

export const setVerses = (
  verses: Database['public']['Tables']['Verse']['Row'][],
  verseId: onlineListDefaultItem['id'] | null
) => {
  const transformedVerses: onlineListDefaultItem[] = verses
    .sort((verse1, verse2) => verse1.index - verse2.index)
    .map(
      verse => ({
        id: verse.id,
        data: verse.text,
        mark: verse.index.toString()
      })
    )
  return async (dispatch: AppDispatch) => {
    dispatch(versesSlice.actions.setItems(transformedVerses))
    if (transformedVerses.length > 0) {
      await dispatch(setCurrentVerse(verseId ?? transformedVerses[0].id))
    }
  }
}

export const setCurrentVerse = (verseId: onlineListDefaultItem['id']) => {
  return async (dispatch: AppDispatch) => {
    dispatch(versesSlice.actions.setCurrent(verseId))
  }
}

export const setNextVerseCurrent = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState()[onlineListStores.verses]
  const currentVerseIndex = state.items.findIndex(item => item.id === state.currentId)
  if (currentVerseIndex !== -1) {
    const nextVerse = state.items.at(currentVerseIndex + 1)
    if (nextVerse) {
      dispatch(setCurrentVerse(nextVerse.id))
    }
  }
}

export const setPreviousVerseCurrent = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState()[onlineListStores.verses]
  const currentVerseIndex = state.items.findIndex(item => item.id === state.currentId)
  if (currentVerseIndex > 0) {
    const nextVerse = state.items.at(currentVerseIndex - 1)
    if (nextVerse) {
      dispatch(setCurrentVerse(nextVerse.id))
    }
  }
}