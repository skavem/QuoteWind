import { useTheme } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { SongFields } from "./songs/SongModal"
import { onlineListDefaultItem } from "../../types/onlineList"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"
import { useAppDispatch } from "../../store/hooks"

const useSongModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalItem, setModalItem] = useState<SongFields | null>(null)

  const dispatch = useAppDispatch()
  
  const handleModalOpen = (item: onlineListDefaultItem | null) => {
    if (item) {
      setModalItem({label: item.mark ?? '', name: item.data, id: item.id})
    } else {
      setModalItem({label: '', name: ''})
    }
    dispatch(setHotkeysBlocked(true))
    setModalOpen(true)
  }

  const handleModalClose = () => {
    dispatch(setHotkeysBlocked(false))
    setModalOpen(false)
    setModalItem(null)
  }

  const { enqueueSnackbar } = useSnackbar()

  const theme = useTheme()

  return {
    handleModalOpen,
    handleModalClose,
    enqueueSnackbar,
    theme,
    modalOpen,
    modalItem
  }
}

export default useSongModal