import { Box, Pagination, PaginationItem, useMediaQuery, useTheme } from '@mui/material'
import { Add, Delete, Edit, Star } from '@mui/icons-material'
import { onlineListStores } from '../../../store'
import { useAppDispatch } from '../../../store/hooks'
import { setCurrentSong } from '../../../store/songs/songsAPI'
import OnlineList from '../../OnlineList/OnlineList'
import SongAutocomplete from '../SongAutocomplete'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import OnlineListMenu from './OnlineListMenu'
import { addSongsFav } from '../../../store/songFavorites/songFavoritesAPI'
import useSongPagination from '../useSongPagination'
import useSongModal from '../useSongModal'
import SongModal from './SongModal'
import { supabase } from '../../../supabase'
import { Song } from '../../../store/songs/songsReducer'

const SongsList = () => {
  const { page, pagesCount, setPage, songsOnPage } = useSongPagination()
  const menuProps = useContextMenuWithItem<Song>()

  const modalProps = useSongModal()

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('xl'));
  
  const dispatch = useAppDispatch()

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1} alignItems='center'>
      <SongAutocomplete />

      <OnlineList
        reduxStoreName={onlineListStores.songs}
        onClick={item => dispatch(setCurrentSong(item.id))}
        itemsOnPage={songsOnPage}
        page={page}
        onItemContextMenu={menuProps.handleContextMenu}
        onContextMenu={(e) => menuProps.handleContextMenu(e, null)}
      />
      <Pagination
        size={matches ? 'medium' : 'small'}
        variant='outlined'
        color='primary'
        page={page}
        count={pagesCount}
        onChange={(e, page) => setPage(page)}
        renderItem={(props) => (
          <PaginationItem 
            {...props} 
            sx={{ padding: 0.25, margin: 0.125 }}
          />
        )}
      />

      <SongModal {...modalProps} />

      <OnlineListMenu 
        {...menuProps}
        actions={[
          {
            icon: Star, 
            text: 'В план', 
            async onClick(item) {
              if (item)
              await dispatch(addSongsFav(item))
            },
            dividerAfter: true,
            shown: item => !!item
          }, 
          {
            icon: Edit,
            text: 'Изменить',
            async onClick(item) {
              modalProps.handleOpen(item)
            },
            shown: item => !!item
          },
          {
            icon: Delete,
            text: 'Удалить',
            async onClick(item) {
              if (item)
              await supabase.from('Song').delete().eq('id', item.id)
            },
            dividerAfter: true,
            shown: item => !!item
          },
          {
            icon: Add,
            text: 'Добавить',
            async onClick(item) {
              modalProps.handleOpen(null)
            }
          }
        ]}
      />
    </Box>
  )
}

export default SongsList