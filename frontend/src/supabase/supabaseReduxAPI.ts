import {  useEffect } from "react";
import { DBTables, StateRow } from '../types/supabase'
import { useAppDispatch } from "../store/hooks";
import { setBooks } from "../store/books/booksApi";
import { setShownCouplet, setShownVerse } from "../store/shown/shownAPI";
import { supabase } from ".";
import { historyItem } from "../store/verseHistory/verseHistoryReducer";
import { AppDispatch } from "../store";
import { addHistoryVerse } from "../store/verseHistory/verseHistoryAPI";
import { addSong, deleteSong, setSongs, updateSong } from "../store/songs/songsAPI";

export const useSupabaseReduxSubscription = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    (async () => {
      const { data: books } = await supabase.from('Book').select()
      if (books) {
        dispatch(setBooks(books))
      }
      const { data: states } = await supabase.from('State').select()
      if (states) {
        dispatch(setShownVerse(states[0]['verse_id']))
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