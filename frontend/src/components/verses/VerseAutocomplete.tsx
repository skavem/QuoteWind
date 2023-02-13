import { DBTables } from '../../types/supabase-extended'
import { supabase } from '../../supabase'
import { useAppDispatch } from '../../store/hooks'
import { setCurrentBook } from '../../store/books/booksApi'
import AutocompleteSearch from '../Autocomplete/AutocompleteSearch'

interface SearchedVerse {
  id: DBTables['Verse']['Row']['id']
  bookId: DBTables['Book']['Row']['id'],
  chapterId: DBTables['Chapter']['Row']['id'],
  verseId: DBTables['Verse']['Row']['id'],
  data: DBTables['Verse']['Row']['text'],
  mark: string
}

const findAndSetVerses = async (
  debouncedInput: string
) => {
  if (debouncedInput.length < 3) {
    return []
  }

  if (/[А-Яа-я\d\s]+\s\d+:\d+/gi.test(debouncedInput)) {
    const splitInput = debouncedInput.split(' ')
    const bookName = splitInput.slice(0, -1).join(' ')
    const chapterIndex = +splitInput.slice(-1)[0].split(':')[0]
    const verseIndex = +splitInput.slice(-1)[0].split(':')[1]

    const { data: books } = await supabase
      .from('Book')
      .select('id, name')
      .or(`name.ilike.*${bookName}*,full_name.ilike.*${bookName}*`)
    
    if (!books || books.length === 0) return []
    
    const { data: chapters } = await supabase
      .from('Chapter')
      .select('id')
      .in('book_id', books.map(book => book.id))
      .eq('index', chapterIndex)

    if (!chapters || chapters.length === 0) return []

    const { data: verses } = await supabase
      .from('Verse')
      .select(`id, text, index, chapter_id (
        chapterId:id, chapterIndex:index, book_id (
          bookId:id, bookName:name
        )
      )`)
      .in('chapter_id', chapters.map(chapter => chapter.id))
      .eq('index', verseIndex)

    if (!verses || verses.length === 0) return []

    console.log(verses)

    return verses
      .filter((verse): verse is {
        id: number, text: string, index: number, chapter_id: {
          chapterId: number, chapterIndex: number, book_id: {
            bookId: number, bookName: string
          }
        }
      } => {
        return true
      }).map((verse) => (
        {
          id: verse.id,
          bookId: verse.chapter_id.book_id.bookId,
          chapterId: verse.chapter_id.chapterId,
          verseId: verse.id,
          data: verse.text,
          mark: `${
            verse.chapter_id.book_id.bookName
          } ${verse.chapter_id.chapterIndex}:${verse.index}`
        } as SearchedVerse
      )) 
  }

  const { data: verses, error } = await supabase
    .from('Verse')
    .select(
      `text, verseId:id, verseIndex:index,
        chapter_id (chapterId:id, chapterIndex:index,
          book_id (bookId:id, bookName:name)
        )`
    )
    .textSearch('fts', debouncedInput, {type: 'websearch', config:'russian'})
    .range(0, 20)
  
  if (error) console.log(error)

  if (verses) {
    const newVerses: SearchedVerse[] = []
    verses
      .forEach(foundVerse => {
        if (
          foundVerse.chapter_id &&
          !Array.isArray(foundVerse.chapter_id) &&
          foundVerse.chapter_id.book_id &&
          !Array.isArray(foundVerse.chapter_id.book_id)
        ) {
          const bookId = foundVerse.chapter_id.book_id.bookId as number
          const bookName = foundVerse.chapter_id.book_id.bookName
          const chapterId = foundVerse.chapter_id.chapterId as number
          const chapterIndex = foundVerse.chapter_id.chapterIndex as number
          const verseIndex = foundVerse.verseIndex
          newVerses.push({
            id: foundVerse.verseId,
            data: foundVerse.text,
            mark: `${bookName} ${chapterIndex}:${verseIndex}`,
            bookId:  bookId,
            chapterId: chapterId,
            verseId: foundVerse.verseId
          })
        }
      })
    return newVerses
  }

  return []
}


const VerseAutocomplete = () => {
  const dispatch = useAppDispatch()

  return (
    <AutocompleteSearch 
      searchFn={findAndSetVerses}
      setCurrentFn={value => dispatch(
        setCurrentBook(value.bookId, value.chapterId, value.verseId)
      )}
      textfieldLabel={'Текст или ссылка'}
    />
  )
}

export default VerseAutocomplete