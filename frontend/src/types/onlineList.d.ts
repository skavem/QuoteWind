export interface onlineListDefaultItem {
  id: number,
  mark?: string,
  data: string
}

export interface onlineListInitialState<T = onlineListDefaultItem> {
  items: T[],
  currentId: T['id'] | null
}

export type onlineListReducers = ValidateSliceCaseReducers<
  onlineListInitialState,
  {
    setItems: (
      state: WritableDraft<onlineListInitialState>, 
      action: PayloadAction<onlineListDefaultItem[]>
    ) => void
    setCurrent: (
      state: WritableDraft<onlineListInitialState>, 
      action: PayloadAction<onlineListDefaultItem['id']>
    ) => void
  }
>