import { DBTables } from '../../types/supabase'
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

  if (/[А-Яа-я]+\s\d+:\d+/gi.test(debouncedInput)) {
    const splitInput = debouncedInput.split(' ')
    const bookName = splitInput[0]
    const chapterIndex = +splitInput[1].split(':')[0]
    const verseIndex = +splitInput[1].split(':')[1]

    const { data: books } = await supabase
      .from('Book')
      .select('id, name')
      .or(`name.ilike.*${bookName}*,full_name.ilike.*${bookName}*`)
    
    if (!books || books.length === 0) return []
    
    const { data: chapters } = await supabase
      .from('Chapter')
      .select('id')
      .eq('book_id', books[0].id)
      .eq('index', chapterIndex)

    if (!chapters || chapters.length === 0) return []

    const { data: verses } = await supabase
      .from('Verse')
      .select('id, text')
      .eq('chapter_id', chapters[0].id)
      .eq('index', verseIndex)

    if (!verses || verses.length === 0) return []

    return [{
      id: verses[0].id,
      bookId: books[0].id,
      chapterId: chapters[0].id,
      verseId: verses[0].id,
      data: verses[0].text,
      mark: `${books[0].name} ${chapterIndex}:${verseIndex}`
    } as SearchedVerse]
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