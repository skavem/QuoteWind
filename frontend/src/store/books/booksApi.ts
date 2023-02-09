import { AppDispatch, onlineListStores, RootState } from ".."
import { Database } from "../../types/supabase"
import { BookItem, booksSlice } from "./booksReducer"
import { onlineListDefaultItem } from "../../types/onlineList";
import { supabase } from "../../supabase";
import { setChapters, setCurrentChapter } from "../chapters/chaptersAPI";

export const setBooks = (
  books: Database['public']['Tables']['Book']['Row'][]
) => {
  const transformedBooks: BookItem[] = books
    .sort((book1, book2) => book1.index - book2.index)
    .map(
      book => ({
        id: book.id,
        data: book.full_name,
        mark: book.name,
        part: book.divider_before
      })
    )
  return async (dispatch: AppDispatch) => {
    dispatch(booksSlice.actions.setItems(transformedBooks))
    if (transformedBooks.length > 0) {
      dispatch(setCurrentBook(transformedBooks[0].id))
    }
  }
}

export const setCurrentBook = (
  bookId: onlineListDefaultItem['id'],
  chapterId: onlineListDefaultItem['id'] | null = null,
  verseId: onlineListDefaultItem['id'] | null = null
) => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState()[onlineListStores.books].currentId !== bookId) { 
    dispatch(booksSlice.actions.setCurrent(bookId))
    const { data: chapters } = await supabase
      .from('Chapter')
      .select()
      .eq('book_id', bookId)
    
    if (chapters) {
      await dispatch(setChapters(chapters))
    }
  }

  if (chapterId) {
    await dispatch(setCurrentChapter(chapterId, verseId))
  }
}