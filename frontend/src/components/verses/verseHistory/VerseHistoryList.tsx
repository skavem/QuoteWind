import { onlineListStores } from '../../../store'
import { setCurrentBook } from '../../../store/books/booksApi'
import { useAppDispatch } from '../../../store/hooks'
import OnlineList from '../../OnlineList/OnlineList'
import { historyItem } from '../../../store/verseHistory/verseHistoryReducer'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import VerseHistoryMenu from './VerseHistoryMenu'

const VerseHistoryList = () => {
  const {contextMenu, handleClose, handleContextMenu} = useContextMenuWithItem<historyItem>()

  const dispatch = useAppDispatch()

  return (
    <>
      <OnlineList
        reduxStoreName={onlineListStores.verseHistory}
        onClick={(item) => {
          dispatch(setCurrentBook(item.bookId, item.chapterId, item.verseId))
        }}
        onItemContextMenu={handleContextMenu}
      />
      <VerseHistoryMenu 
        contextMenu={contextMenu}
        handleClose={handleClose}
        handleContextMenu={handleContextMenu}
        dispatch={dispatch}
      />
    </>
  )
}

export default VerseHistoryList