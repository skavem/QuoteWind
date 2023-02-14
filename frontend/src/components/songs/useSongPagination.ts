import React, { useState, useEffect, useCallback } from 'react'
import { onlineListStores } from '../../store'
import { useAppSelector } from '../../store/hooks'

const songsOnPage = 20

const useSongPagination = () => {
  const [page, setPage] = useState(1)

  const songs = useAppSelector(state => state[onlineListStores.songs].items)
  const pagesCount = Math.ceil(songs.length / songsOnPage)

  const currentSongId = useAppSelector(state => state[onlineListStores.songs].currentId)

  // TODO: get rid of useEffect here
  const updateCurrentPage = useCallback(() => {
    if (songs.length < 1) return

    const curIndex = songs.findIndex((song) => song.id === currentSongId)
    const newPage = Math.ceil((curIndex + 1) / songsOnPage)
    
    setPage(newPage)
  }, [setPage, currentSongId, songs])

  useEffect(() => {
    updateCurrentPage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongId, songs])

  return { page, setPage, pagesCount, songsOnPage }
}

export default useSongPagination