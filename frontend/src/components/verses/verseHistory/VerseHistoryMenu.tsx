import { NearMe, Visibility, Delete, DeleteSweep } from '@mui/icons-material'
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { setCurrentBook } from '../../../store/books/booksApi'
import { removeHistoryVerse, clearHistoryVerses } from '../../../store/verseHistory/verseHistoryAPI'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import { historyItem } from '../../../store/verseHistory/verseHistoryReducer'
import { AppDispatch } from '../../../store'
import { supabaseAPI } from '../../../supabase/supabaseAPI'

type VerseHistoryMenuProps = {
  dispatch: AppDispatch
} & ReturnType<typeof useContextMenuWithItem<historyItem>> 

const VerseHistoryMenu = ({
  contextMenu,
  handleClose,
  handleContextMenu,
  dispatch
}: VerseHistoryMenuProps) => {
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
            await dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
          }
          handleClose()
        }}
      >
        <ListItemIcon>
          <NearMe fontSize="small"/>
        </ListItemIcon>
        <ListItemText>Перейти</ListItemText>
      </MenuItem>
      <MenuItem 
        dense 
        onClick={async () => {
          if (contextMenu?.item) {
            const item = contextMenu.item
            await dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
            await supabaseAPI.showVerse(item, dispatch)
          }
          handleClose()
        }}
      >
        <ListItemIcon>
          <Visibility fontSize="small"/>
        </ListItemIcon>
        <ListItemText>Перейти и показать</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem 
        dense 
        onClick={async () => {
          if (contextMenu?.item) {
            const item = contextMenu.item
            await dispatch(removeHistoryVerse(item))
          }
          handleClose()
        }}
      >
        <ListItemIcon>
          <Delete fontSize="small"/>
        </ListItemIcon>
        <ListItemText>Удалить</ListItemText>
      </MenuItem>
      <MenuItem 
        dense 
        onClick={async () => {
          if (contextMenu?.item) {
            await dispatch(clearHistoryVerses())
          }
          handleClose()
        }}
      >
        <ListItemIcon>
          <DeleteSweep fontSize="small"/>
        </ListItemIcon>
        <ListItemText>Удалить все</ListItemText>
      </MenuItem>
    </Menu>
  )
}

export default VerseHistoryMenu