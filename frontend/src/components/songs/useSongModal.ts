import { useState } from "react"
import { SongFields } from "./songs/SongModal"
import { setHotkeysBlocked } from "../../store/hotkeysBlockReducer"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import useModalForm from "../ModalForm/useModalForm"
import { Song } from "../../store/songs/songsReducer"
import { onlineListStores } from "../../store"

const getNewSongNumber = (songs: Song[]) => {
  const lastSongNumber = songs.slice(-1)[0].mark
  return +lastSongNumber < 13600 ? 13601 : +lastSongNumber + 1
}

const useSongModal = () => {
  const modalProps = useModalForm()
  const [modalItem, setModalItem] = useState<SongFields | null>(null)
  const songs = useAppSelector(state => state[onlineListStores.songs].items)

  const dispatch = useAppDispatch()
  const handleOpen = (item: Song | null) => {
    if (item) {
      setModalItem({label: +item.mark, name: item.data, id: item.id})
    } else {
      setModalItem({label: getNewSongNumber(songs), name: ''})
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