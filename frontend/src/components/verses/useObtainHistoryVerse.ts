import { onlineListStores } from "../../store"
import { useAppSelector } from "../../store/hooks"
import { historyItem } from "../../store/verseHistory/verseHistoryReducer"

const useObtainHistoryVerse: () => Omit<historyItem, 'id'> | null = () => {
  const currentBookId = useAppSelector(state => state[onlineListStores.books].currentId)
  const books = useAppSelector(state => state[onlineListStores.books].items)
  const currentBook = books.find(book => book.id === currentBookId)
  
  const currentChapterId = useAppSelector(state => state[onlineListStores.chapters].currentId)
  const chapters = useAppSelector(state => state[onlineListStores.chapters].items)
  const currentChapter = chapters.find(chapter => chapter.id === currentChapterId)

  const currentVerseId = useAppSelector(state => state[onlineListStores.verses].currentId)
  const verses = useAppSelector(state => state[onlineListStores.verses].items)
  const currentVerse = verses.find(verse => verse.id === currentVerseId)

  if (
    !currentBook || !currentChapter || !currentVerse
    || !currentBookId || !currentChapterId || !currentVerseId
  ) {
    return null
  }

  return {
    bookId: currentBookId,
    chapterId: currentChapterId,
    verseId: currentVerseId,
    data: currentVerse.data,
    mark: `${currentBook.mark} ${currentChapter.data}:${currentVerse.mark}`
  }
}

export default useObtainHistoryVerse 