import { useState } from "react"
import { CoupletFields } from "./songs/CoupletModal"
import { onlineListStores, RootState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { DBTables } from "../../types/supabase-extended"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"
import useModalForm from "../ModalForm/useModalForm"

const useCoupletModal = () => {
  const modalProps = useModalForm()
  const [modalItem, setModalItem] = useState<CoupletFields | null>(null)

  const couplets = useAppSelector(state => state[onlineListStores.couplets].items)

  const dispatch = useAppDispatch()

  const handleOpen = (
    couplet: RootState[onlineListStores.couplets]['items'][0] | null,
    songId: DBTables['Song']['Row']['id'],
    index?: DBTables['Couplet']['Row']['id']
  ) => {
    if (couplet) {
      setModalItem({
        label: couplet.mark ?? '',
        text: couplet.data,
        id: couplet.id,
        index: couplets.findIndex(value => value.id === couplet.id) + 1
      })
    } else {
      setModalItem({
        label: '',
        text: '',
        songId,
        index: index ?? couplets.length + 1
      })
    }
    dispatch(setHotkeysBlocked(true))
    modalProps.handleOpen()
  }

  const handleClose = () => {
    dispatch(setHotkeysBlocked(false))
    modalProps.handleClose()
    setModalItem(null)
  }

  return {
    handleOpen,
    handleClose,
    enqueueSnackbar: modalProps.enqueueSnackbar,
    theme: modalProps.theme,
    isOpen: modalProps.isOpen,
    modalItem
  }
}

export default useCoupletModal