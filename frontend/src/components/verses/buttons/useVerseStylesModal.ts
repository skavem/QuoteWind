import { useTheme } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { useAppDispatch } from "../../../store/hooks"
import { setHotkeysBlocked } from "../../../store/hotkeysBlockReducer"

const useVerseStylesModal = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const dispatch = useAppDispatch()
  
  const handleModalOpen = () => {
    dispatch(setHotkeysBlocked(true))
    setModalOpen(true)
  }

  const handleModalClose = () => {
    dispatch(setHotkeysBlocked(false))
    setModalOpen(false)
  }

  const { enqueueSnackbar } = useSnackbar()

  const theme = useTheme()

  return {
    handleModalOpen,
    handleModalClose,
    enqueueSnackbar,
    theme,
    modalOpen
  }
}

export default useVerseStylesModal