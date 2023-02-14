import React from "react";
import { supabase } from "."
import { AppDispatch } from "../store";
import { setBooks } from "../store/books/booksApi";
import { useAppDispatch } from "../store/hooks";
import { setShownCouplet, setShownVerse, setStyles } from "../store/shown/shownAPI";
import { CoupletStyles, defaultStyles, QrStyles, Styles, VerseStyles } from "../store/shown/shownReducer"
import { addSong, deleteSong, setSongs, updateSong } from "../store/songs/songsAPI";
import { addHistoryVerse } from "../store/verseHistory/verseHistoryAPI";
import { historyItem } from "../store/verseHistory/verseHistoryReducer";
import { Json } from "../types/supabase"
import { DBTables, StateRow } from "../types/supabase-extended";

export const isValidObject = (data: Json | undefined): data is {
  [key: string]: Json;
} => {
  return !!(data && typeof data === 'object' && !Array.isArray(data))
}

export const isValidQrStylesObject = (data: Json): data is QrStyles => {
  return isValidObject(data) 
    && 'data' in data && typeof data.data === 'string' 
    && 'shown' in data && typeof data.shown === 'boolean'
    && 'size' in data && (
      typeof data.size === 'number' || typeof data.size === 'string'
    )
    && 'bgColor' in data && typeof data.bgColor === 'string'
    && 'fgColor' in data && typeof data.fgColor === 'string'
}
export const isValidCoupletStylesObject = (data: Json): data is CoupletStyles => {
  return isValidObject(data)
    && 'lineHeight' in data && (
      typeof data.lineHeight === 'number' || typeof data.lineHeight === 'string'
    ) 
    && 'backgroundColor' in data && typeof data.backgroundColor === 'string'
    && 'color' in data && typeof data.color === 'string'
}
export const isValidVerseStylesObject = (data: Json): data is VerseStyles => {
  return isValidObject(data)
    && 'lineHeight' in data && (
      typeof data.lineHeight === 'number' || typeof data.lineHeight === 'string'
    )
    && 'backgroundColor' in data && typeof data.backgroundColor === 'string'
    && 'color' in data && typeof data.color === 'string'
}
export const isValidStylesObject = (data: Json): data is Styles => {
  return isValidObject(data)
    && 'qr' in data && isValidQrStylesObject(data.qr)
    && 'couplet' in data && isValidCoupletStylesObject(data.couplet)
    && 'verse' in data && isValidVerseStylesObject(data.verse)
}

export const supabaseAPI = {
  async getStyles() {
    const { data } = await supabase
      .from('State')
      .select('styles')
      .eq('id', 1)
      .single()
    
    if (!data) return null
    const styles = data.styles
    if (isValidObject(styles)) {
      return styles as Styles
    }
    return null
  },

  async setStyles(styles: Styles) {
    return await supabase
      .from('State')
      .update({ styles })
      .eq('id', 1)
  },

  async getQrStyles() {
    const styles = await this.getStyles()
    if (styles && styles.qr) {
      return styles.qr
    }
    return null
  },

  async setQrStyles(qrStyles: QrStyles) {
    let styles = await this.getStyles()
    if (!isValidStylesObject(styles)) {
      return await this.setStyles({...defaultStyles, qr: qrStyles})
    }
    return await this.setStyles({...styles, qr: qrStyles})
  },

  async getCoupletStyles() {
    const styles = await this.getStyles()
    if (styles && styles.couplet) {
      return styles.couplet
    }
    return null
  },

  async setCoupletStyles(coupletStyles: CoupletStyles) {
    let styles = await this.getStyles()
    if (!isValidStylesObject(styles)) {
      console.log(styles)
      return await this.setStyles({ ...defaultStyles, couplet: coupletStyles })
    }
    return await this.setStyles({ ...styles, couplet: coupletStyles })
  },

  async getVerseStyles() {
    const styles = await this.getStyles()
    if (styles && styles.verse) {
      return styles.verse
    }
    return null
  },

  async setVerseStyles(verseStyles: VerseStyles) {
    let styles = await this.getStyles()
    if (!isValidStylesObject(styles)) {
      return await this.setStyles({ ...defaultStyles, verse: verseStyles })
    }
    return await this.setStyles({ ...styles, verse: verseStyles })
  },

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

export const useSupabaseReduxSubscription = () => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
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