import { AppDispatch } from ".."
import { historyVerseItem, verseHistorySlice } from "./verseHistoryReducer"

export const addHistoryVerse = (
  verse: Omit<historyVerseItem, 'id'>
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(verseHistorySlice.actions.addItem({
      ...verse,
      id: Math.random()
    }))
  }
}

export const clearHistoryVerses = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(verseHistorySlice.actions.setItems([]))
  }
}

export const removeHistoryVerse = (verse: historyVerseItem) => {
  return async (dispatch: AppDispatch) => {
    dispatch(verseHistorySlice.actions.removeItem(verse))
  }
}