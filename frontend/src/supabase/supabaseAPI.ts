import { supabase } from "."
import { Json } from "../types/supabase"

type QrStyles = {
  data?: string,
  shown?: boolean,
  size?: number,
  bgColor?: string,
  fgColor?: string
}

type CoupletStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}

type VerseStyles = {
  lineHeight?: number,
  backgroundColor?: string,
  color?: string
}

type Styles = {
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