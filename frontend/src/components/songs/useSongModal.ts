import { useState } from "react"
import { SongFields } from "./songs/SongModal"
import { onlineListDefaultItem } from "../../types/onlineList"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"
import { useAppDispatch } from "../../store/hooks"
import useModalForm from "../ModalForm/useModalForm"

const useSongModal = () => {
  const modalProps = useModalForm()
  const [modalItem, setModalItem] = useState<SongFields | null>(null)

  const dispatch = useAppDispatch()
  const handleOpen = (item: onlineListDefaultItem | null) => {
    if (item) {
      setModalItem({label: item.mark ? +item.mark : null, name: item.data, id: item.id})
    } else {
      setModalItem({label: null, name: ''})
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

export default useSongModal