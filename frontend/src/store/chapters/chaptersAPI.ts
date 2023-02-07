import { AppDispatch, onlineListStores, RootState } from ".."
import { Database } from "../../types/supabase"
import { chaptersSlice } from "./chaptersReducer"
import { onlineListDefaultItem } from "../../types/onlineList";
import { supabase } from "../../supabase";
import { setCurrentVerse, setVerses } from "../verses/versesAPI";

export const setChapters = (
  chapters: Database['public']['Tables']['Chapter']['Row'][]
) => {
  const transformedChapters: onlineListDefaultItem[] = chapters
    .sort((verse1, verse2) => verse1.index - verse2.index)
    .map(
      chapter => ({
        id: chapter.id,
        data: chapter.index.toString()
      })
    )
  return async (dispatch: AppDispatch) => {

    dispatch(chaptersSlice.actions.setItems(transformedChapters))
    if (transformedChapters.length > 0) {
      await dispatch(setCurrentChapter(transformedChapters[0].id))
    }
  }
}

export const setCurrentChapter = (
  chapterId: onlineListDefaultItem['id'],
  verseId: onlineListDefaultItem['id'] | null = null
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState()[onlineListStores.chapters].currentId !== chapterId) { 
      dispatch(chaptersSlice.actions.setCurrent(chapterId))
      
      const { data: verses } = await supabase
        .from('Verse')
        .select()
        .eq('chapter_id', chapterId)
      
      if (verses) {
        verses.sort((verse1, verse2) => verse1.index - verse2.index)
        await dispatch(setVerses(verses, verseId))
      }
    } else if (verseId) {
      await dispatch(setCurrentVerse(verseId))
    }
  }
}