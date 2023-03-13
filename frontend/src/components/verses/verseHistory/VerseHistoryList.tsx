import { onlineListStores } from '../../../store'
import { setCurrentBook } from '../../../store/books/booksApi'
import { useAppDispatch } from '../../../store/hooks'
import OnlineList from '../../OnlineList/OnlineList'
import { historyVerseItem } from '../../../store/verseHistory/verseHistoryReducer'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import OnlineListMenu from '../../songs/songs/OnlineListMenu'
import { Delete, DeleteSweep, NearMe, Visibility } from '@mui/icons-material'
import { supabaseAPI } from '../../../supabase/supabaseAPI'
import { clearHistoryVerses, removeHistoryVerse } from '../../../store/verseHistory/verseHistoryAPI'

const VerseHistoryList = () => {
  const menuProps = useContextMenuWithItem<historyVerseItem>()

  const dispatch = useAppDispatch()

  return (
    <>
      <OnlineList
        reduxStoreName={onlineListStores.verseHistory}
        onClick={(item) => {
          dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
        }}
        onItemContextMenu={menuProps.handleContextMenu}
        onContextMenu={(e) => menuProps.handleContextMenu(e, null)}
      />
      <OnlineListMenu 
        {...menuProps}
        actions={[
          {
            icon: NearMe,
            text: 'Перейти',
            async onClick(item) {
              if (item) {
                await dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
              }
            },
            shown: item => !!item
          }, 
          {
            icon: Visibility,
            async onClick(item) {
              if (!item) return
              await dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
              await supabaseAPI.showVerse(item, dispatch)
            },
            text: 'Перейти и показать',
            dividerAfter: true,
            shown: item => !!item
          },
          {
            icon: Delete,
            async onClick(item) {
              if (item) {
                await dispatch(removeHistoryVerse(item))
              }
            },
            text: 'Удалить',
            shown: item => !!item
          },
          {
            icon: DeleteSweep,
            async onClick(item) {
              await dispatch(clearHistoryVerses())
            },
            text: 'Удалить все'
          }
        ]}
      />
    </>
  )
}

export default VerseHistoryList