import { supabase } from "."
import { CoupletStyles, defaultStyles, QrStyles, Styles, VerseStyles } from "../store/shown/shownReducer"
import { Json } from "../types/supabase"

export const isValidObject = (data: Json | undefined): data is {
  [key: string]: Json;
} => {
  return !!(data && typeof data === 'object' && !Array.isArray(data))
}

export const isValidQrStylesObject = (data: Json): data is QrStyles => {
  return isValidObject(data) 
    && 'data' in data && typeof data.data === 'string' 
    && 'shown' in data && typeof data.shown === 'boolean'
    && 'size' in data && typeof data.size === 'number'
    && 'bgColor' in data && typeof data.bgColor === 'string'
    && 'fgColor' in data && typeof data.fgColor === 'string'
}
export const isValidCoupletStylesObject = (data: Json): data is CoupletStyles => {
  return isValidObject(data)
    && 'lineHeight' in data && typeof data.lineHeight === 'number' 
    && 'backgroundColor' in data && typeof data.backgroundColor === 'string'
    && 'color' in data && typeof data.color === 'string'
}
export const isValidVerseStylesObject = (data: Json): data is VerseStyles => {
  return isValidObject(data)
    && 'lineHeight' in data && typeof data.lineHeight === 'number' 
    && 'backgroundColor' in data && typeof data.backgroundColor === 'string'
    && 'color' in data && typeof data.color === 'string'
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
    if (!isValidQrStylesObject(styles)) {
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
    if (!isValidCoupletStylesObject(styles)) {
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
    if (!isValidVerseStylesObject(styles)) {
      return await this.setStyles({ ...defaultStyles, verse: verseStyles })
    }
    return await this.setStyles({ ...styles, verse: verseStyles })
  }
}