import { useEffect, useState } from "react"
import { supabase } from "."
import { Json } from "../types/supabase"
import { StateRow } from "../types/supabase-extended"

export type QrStyles = {
  data?: string,
  shown?: boolean,
  size?: number,
  bgColor?: string,
  fgColor?: string
}

export type CoupletStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}

export type VerseStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}

export type Styles = {
  qr?: QrStyles
  couplet?: CoupletStyles
}

export const isValidObject = (data: Json | undefined): data is {
  [key: string]: Json;
} => {
  return !!(data && typeof data === 'object' && !Array.isArray(data))
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
      return styles as {
        qr?: QrStyles,
        couplet?: CoupletStyles,
        verse?: VerseStyles
      }
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
    if (styles) {
      if (styles.qr) {
        styles.qr = { ...styles.qr, ...qrStyles }
      } else {
        styles.qr = qrStyles
      }
    } else {
      styles = { qr: qrStyles }
    }
    return await this.setStyles(styles)
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
    if (styles) {
      if (styles.couplet) {
        styles.couplet = { ...styles.couplet, ...coupletStyles }
      } else {
        styles.couplet = coupletStyles
      }
    } else {
      styles = { couplet: coupletStyles }
    }
    return await this.setStyles(styles)
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
    if (styles) {
      if (styles.verse) {
        styles.verse = { ...styles.verse, ...verseStyles }
      } else {
        styles.verse = verseStyles
      }
    } else {
      styles = { verse: verseStyles }
    }
    return await this.setStyles(styles)
  }
}

export const useSupabaseQr = () => {
  const [qrShown, setQrShown] = useState(false)
  const [qrStyles, setQrStyles] = useState<QrStyles>({})

  useEffect(() => {
    (async () => {
      const styles = await supabaseAPI.getQrStyles()
      if (styles && 'data' in styles && 'shown' in styles) {
        setQrStyles(styles)
        setQrShown(styles.shown as boolean && styles.data !== '')
      }
    })();

    const subscription = supabase
      .channel('public:QrState')
      .on<StateRow>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'State' },
        payload => {
          if (
            isValidObject(payload.new.styles) && isValidObject(payload.new.styles.qr)
          ) {
            const qrStyles = payload.new.styles.qr
            setQrStyles(qrStyles)
            setQrShown(qrStyles.shown as boolean && qrStyles.data !== '')
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [setQrStyles, setQrShown])

  return { qrShown, qrStyles }
}

export const useSupabaseCoupletStyles = () => {
  const [coupletStyles, setCoupletStyles] = useState<CoupletStyles>({})

  useEffect(() => {
    (async () => {
      const styles = await supabaseAPI.getCoupletStyles()
      if (styles) {
        setCoupletStyles(styles)
      }
    })();

    const subscription = supabase
      .channel('public:CoupletState')
      .on<StateRow>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'State' },
        payload => {
          if (
            isValidObject(payload.new.styles) && isValidObject(payload.new.styles.couplet)
          ) {
            const coupletStyles = payload.new.styles.couplet
            setCoupletStyles(coupletStyles)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [setCoupletStyles])

  return { coupletStyles }
}

export const useSupabaseVerseStyles = () => {
  const [verseStyles, setVerseStyles] = useState<CoupletStyles>({})

  useEffect(() => {
    (async () => {
      const styles = await supabaseAPI.getVerseStyles()
      if (styles) {
        setVerseStyles(styles)
      }
    })();

    const subscription = supabase
      .channel('public:VerseState')
      .on<StateRow>(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'State' },
        payload => {
          if (
            isValidObject(payload.new.styles) && isValidObject(payload.new.styles.verse)
          ) {
            const verseStyles = payload.new.styles.verse
            setVerseStyles(verseStyles)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [setVerseStyles])

  return { verseStyles }
}