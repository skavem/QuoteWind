import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StateRow } from "../../types/supabase-extended";

export type QrStyles = {
  data: string,
  shown: boolean,
  size: number,
  bgColor: string,
  fgColor: string
}

export type CoupletStyles = {
  lineHeight: number,
  backgroundColor: string,
  color: string
}

export type VerseStyles = {
  lineHeight: number,
  backgroundColor: string,
  color: string
}

export type Styles = {
  qr: QrStyles
  couplet: CoupletStyles,
  verse: VerseStyles
}

export const defaultStyles: Styles = {
  couplet: {
    backgroundColor: '#000000d0',
    color: '#ffffffff',
    lineHeight: 1
  },
  verse: {
    backgroundColor: '#000000d0',
    color: '#ffffffff',
    lineHeight: 1
  },
  qr: {
    bgColor: '#000000d0',
    fgColor: '#ffffffff',
    data: 'Ошибка',
    shown: false,
    size: 35
  }
}

interface stateInitialState {
  currentVerseId: StateRow['verse_id'] | null,
  currentCoupletId: StateRow['couplet_id'] | null,
  styles: Styles | null
}

const initialState: stateInitialState = {
  currentVerseId: null,
  currentCoupletId: null,
  styles: null
}

export const shownSlice = createSlice({
  name: 'shown',
  initialState,
  reducers: {
    setVerseId(state, action: PayloadAction<StateRow['verse_id']>) {
      state.currentVerseId = action.payload
    },
    setCoupletId(state, action: PayloadAction<StateRow['couplet_id']>) {
      state.currentCoupletId = action.payload
    },
    setStyles(state, action: PayloadAction<Styles>) {
      state.styles = action.payload
    }
  }
})

export default shownSlice.reducer