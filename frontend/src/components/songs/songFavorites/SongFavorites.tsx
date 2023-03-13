import React from 'react'
import { Box } from '@mui/material'
import { Delete, DeleteSweep } from '@mui/icons-material'
import { onlineListStores } from '../../../store'
import { useAppDispatch } from '../../../store/hooks'
import { clearSongsFavs, removeSongsFav, setCurrentSongsFav } from '../../../store/songFavorites/songFavoritesAPI'
import { SongFavorite } from '../../../store/songFavorites/songFavoritesReducer'
import { setCurrentSong } from '../../../store/songs/songsAPI'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import OnlineList from '../../OnlineList/OnlineList'
import OnlineListMenu from '../songs/OnlineListMenu'

const SongFavorites = () => {
  const dispatch = useAppDispatch()
  const menuProps = useContextMenuWithItem<SongFavorite>()

  return (
    <Box flex={'1 1'} minHeight={0}>
      <OnlineList
        reduxStoreName={onlineListStores.songFavorites}
        onClick={songFav => {
          dispatch(setCurrentSong(songFav.songId))
          dispatch(setCurrentSongsFav(songFav))
        }}
        onItemContextMenu={menuProps.handleContextMenu}
        onContextMenu={(e) => menuProps.handleContextMenu(e, null)}
      />
      <OnlineListMenu 
        {...menuProps} 
        actions={[
          {
            icon: Delete,
            async onClick(item) {
              if (item) {
                await dispatch(removeSongsFav(item))
              }
            },
            text: 'Удалить',
            shown: item => !!item
          },
          {
            icon: DeleteSweep,
            async onClick(item) {
              await dispatch(clearSongsFavs())
            },
            text: 'Удалить все'
          }
        ]}
      />
    </Box>
  )
}

export default SongFavorites