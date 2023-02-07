import { AppDispatch, onlineListStores, RootState } from "..";
import { DBTables } from "../../types/supabase";
import { Couplet, coupletsSlice } from "./coupletsReducer";

export const setCouplets = (
  couplets: DBTables['Couplet']['Row'][],
  coupletId: Couplet['id'] | null = null
) => async (dispatch: AppDispatch) => {
  const transformedCouplets: Couplet[] = couplets
    .sort((couplet1, couplet2) => couplet1.index - couplet2.index)
    .map(couplet => ({
      id: couplet.id,
      data: couplet.text ?? '',
      mark: couplet.label ?? undefined
    })) 
  dispatch(coupletsSlice.actions.setItems(transformedCouplets))
  if (transformedCouplets.length > 0) {
    await dispatch(setCurrentCouplet(coupletId ?? transformedCouplets[0].id))
  }
}

export const setCurrentCouplet = (
  coupletId: Couplet['id']
) => async (dispatch: AppDispatch) => {
  dispatch(coupletsSlice.actions.setCurrent(coupletId))
}

export const deleteCouplet = (
  coupletId: DBTables['Couplet']['Row']['id']
) => async (dispatch: AppDispatch) => {
  dispatch(coupletsSlice.actions.deleteItem(coupletId))
}

export const setNextCoupletCurrent = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState()[onlineListStores.couplets]
  const currentCoupletIndex = state.items.findIndex(item => item.id === state.currentId)
  if (currentCoupletIndex !== -1) {
    const nextCouplet = state.items.at(currentCoupletIndex + 1)
    if (nextCouplet) {
      dispatch(setCurrentCouplet(nextCouplet.id))
    }
  }
}

export const setPreviousCoupletCurrent = () => async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = getState()[onlineListStores.couplets]
  const currentCoupletIndex = state.items.findIndex(item => item.id === state.currentId)
  if (currentCoupletIndex > 0) {
    const nextCouplet = state.items.at(currentCoupletIndex - 1)
    if (nextCouplet) {
      dispatch(setCurrentCouplet(nextCouplet.id))
    }
  }
}