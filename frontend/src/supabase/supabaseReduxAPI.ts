import {  useEffect } from "react";
import { DBTables, StateRow } from '../types/supabase-extended'
import { useAppDispatch } from "../store/hooks";
import { setBooks } from "../store/books/booksApi";
import { setShownCouplet, setShownVerse, setStyles } from "../store/shown/shownAPI";
import { supabase } from ".";
import { historyItem } from "../store/verseHistory/verseHistoryReducer";
import { AppDispatch } from "../store";
import { addHistoryVerse } from "../store/verseHistory/verseHistoryAPI";
import { addSong, deleteSong, setSongs, updateSong } from "../store/songs/songsAPI";
import { Styles } from "../store/shown/shownReducer";

export const useSupabaseReduxSubscription = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    (async () => {
      const { data: books } = await supabase.from('Book').select()
      if (books) {
        dispatch(setBooks(books))
      }
      const { data: state } = await supabase.from('State').select().single()
      if (state) {
        dispatch(setShownVerse(state['verse_id']))
        dispatch(setShownCouplet(state['couplet_id']))
        dispatch(setStyles(state['styles'] as Styles))
      }

      const { data: songs } = await supabase.from('Song').select()
      if (songs) {
        dispatch(setSongs(songs))
      }
    })()

    const stateSubscription = supabase
      .channel('public:State')
      .on<StateRow>(
        'postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'State' }, 
        payload => {
          dispatch(setShownVerse(payload.new.verse_id))
          dispatch(setShownCouplet(payload.new.couplet_id))
          dispatch(setStyles(payload.new.styles as Styles))
        }
      )
      .subscribe()

    const songsSubscription = supabase
      .channel('public:Song')
      .on<DBTables['Song']['Row']>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Song'},
        payload => {
          dispatch(updateSong(payload.new))
        }
      )
      .on<DBTables['Song']['Row']>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Song' },
        payload => {
          dispatch(addSong(payload.new))
        }
      )
      .on<DBTables['Song']['Row']>(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'Song' },
        payload => {
          dispatch(deleteSong(payload.old.id!))
        }
      )
      .subscribe()

    return () => {
      stateSubscription.unsubscribe()
      songsSubscription.unsubscribe()
    }
  }, [dispatch])
}

export const SupabaseReduxAPI = {
  async showVerse(
    verse: Omit<historyItem, 'id'> | null,
    dispatch: AppDispatch
  ) {
    await supabase
      .from('State')
      .update({verse_id: verse ? verse.verseId : null})
      .eq('id', 1)
  
    if (verse) {
      await dispatch(addHistoryVerse(verse))
    }
  },

  async showCouplet(
    coupletId: DBTables['Couplet']['Row']['id'] | null
  ) {
    await supabase
      .from('State')
      .update({couplet_id: coupletId})
      .eq('id', 1)
  }
}