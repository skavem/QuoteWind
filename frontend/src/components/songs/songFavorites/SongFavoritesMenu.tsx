import { Delete } from '@mui/icons-material'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import { AppDispatch } from '../../../store'
import { removeSongsFav } from '../../../store/songFavorites/songFavoritesAPI'
import { SongFavorite } from '../../../store/songFavorites/songFavoritesReducer'

type SongFavoritesMenuProps = {
  dispatch: AppDispatch
} & ReturnType<typeof useContextMenuWithItem<SongFavorite>> 

const SongFavoritesMenu = ({
  contextMenu,
  handleClose,
  handleContextMenu,
  dispatch
}: SongFavoritesMenuProps) => {
  return (
    <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? contextMenu.position
            : undefined
        }
        PaperProps={{ sx: { minWidth: '200px' } }}
      >
      <MenuItem 
        dense 
        onClick={async () => {
          if (contextMenu?.item) {
            const item = contextMenu.item
            await dispatch(removeSongsFav(item))
          }
          handleClose()
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small"/>
        </ListItemIcon>
        <ListItemText>Удалить из плана</ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default SongFavoritesMenu