import { Box } from '@mui/material'
import React from 'react'
import { onlineListStores } from '../../../store'
import { useAppDispatch } from '../../../store/hooks'
import { SongFavorite } from '../../../store/songFavorites/songFavoritesReducer'
import { setCurrentSong } from '../../../store/songs/songsAPI'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import OnlineList from '../../OnlineList/OnlineList'
import SongFavoritesMenu from './SongFavoritesMenu'

const SongFavorites = () => {
  const dispatch = useAppDispatch()
  const menuProps = useContextMenuWithItem<SongFavorite>()

  return (
    <Box display={'flex'} flexGrow={1}>
      <OnlineList
        reduxStoreName={onlineListStores.songFavorites}
        onClick={songFav => dispatch(setCurrentSong(songFav.songId))}
        onItemContextMenu={menuProps.handleContextMenu}
      />
      <SongFavoritesMenu {...menuProps} dispatch={dispatch} />
    </Box>
  )
}

export default SongFavorites