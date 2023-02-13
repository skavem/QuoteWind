import { useTheme } from "@mui/material"
import { useSnackbar } from "notistack"
import { useAppDispatch } from "../../store/hooks"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"
import useModal from "./useModal"

const useModalForm = () => {
  const modalProps = useModal()

  const dispatch = useAppDispatch()
  
  const handleOpen = () => {
    dispatch(setHotkeysBlocked(true))
    modalProps.handleOpen()
  }
  const handleClose = () => {
    dispatch(setHotkeysBlocked(false))
    modalProps.handleClose()
  }

  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()

  return {
    handleOpen,
    handleClose,
    isOpen: modalProps.isOpen,
    enqueueSnackbar,
    theme
  }
}

export default useModalForm