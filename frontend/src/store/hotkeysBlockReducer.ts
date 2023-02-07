import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppDispatch } from "."

const initialState = {
  isBlocked: false
}

export const hotkeysBlock = createSlice({
  initialState,
  name: 'hotkeysBlock',
  reducers: {
    setBlock(state, action: PayloadAction<boolean>) {
      state.isBlocked = action.payload
    }
  }
})

export const setHotkeysBlocked = (isBlocked: boolean) => async (dispatch: AppDispatch) => {
  dispatch(hotkeysBlock.actions.setBlock(isBlocked))
}

export default hotkeysBlock.reducer