import { AppDispatch } from ".."
import { historyItem, verseHistorySlice } from "./verseHistoryReducer"

export const addHistoryVerse = (
  verse: Omit<historyItem, 'id'>
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
export const removeHistoryVerse = (verse: historyItem) => {
  return async (dispatch: AppDispatch) => {
    dispatch(verseHistorySlice.actions.removeItem(verse))
  }
}