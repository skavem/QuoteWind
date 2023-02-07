import { AppDispatch } from "..";
import { StateRow } from "../../types/supabase";
import { shownSlice } from "./shownReducer";

export const setShownVerse = (verseId: StateRow['verse_id'] | null) => {
  return (dispatch: AppDispatch) => {
    dispatch(shownSlice.actions.setVerseId(verseId))
  }
}

export const setShownCouplet = (coupletId: StateRow['couplet_id'] | null) => {
  return (dispatch: AppDispatch) => {
    dispatch(shownSlice.actions.setCoupletId(coupletId))
  }
}
