import { configureStore } from '@reduxjs/toolkit'
import booksReducer from './books/booksReducer'
import chaptersReducer from './chapters/chaptersReducer'
import coupletsReducer from './couplets/coupletsReducer'
import hotkeysBlockReducer from './hotkeysBlockReducer'
import shownReducer from './shown/shownReducer'
import songFavoritesReducer from './songFavorites/songFavoritesReducer'
import songsReducer from './songs/songsReducer'
import verseHistoryReducer from './verseHistory/verseHistoryReducer'
import versesReducer from './verses/versesReducer'

export enum onlineListStores {
  books,
  chapters,
  verses,
  verseHistory,
  songs,
  couplets,
  songFavorites
}

export type onlineListItem = RootState[onlineListStores]['items'][0]

const store = configureStore({
  reducer: {
    [onlineListStores.books]: booksReducer,
    [onlineListStores.chapters]: chaptersReducer,
    [onlineListStores.verses]: versesReducer,
    [onlineListStores.verseHistory]: verseHistoryReducer,
    [onlineListStores.songs]: songsReducer,
    [onlineListStores.couplets]: coupletsReducer,
    [onlineListStores.songFavorites]: songFavoritesReducer,

    shown: shownReducer,
    hotkeysBlock: hotkeysBlockReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store