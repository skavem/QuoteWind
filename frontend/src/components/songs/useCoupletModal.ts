import { useTheme } from "@mui/material"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { CoupletFields } from "./songs/CoupletModal"
import { onlineListStores, RootState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { DBTables } from "../../types/supabase-extended"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"

const useCoupletModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalItem, setModalItem] = useState<CoupletFields | null>(null)

  const couplets = useAppSelector(state => state[onlineListStores.couplets].items)

  const dispatch = useAppDispatch()

  const handleModalOpen = (
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

export default useCoupletModal