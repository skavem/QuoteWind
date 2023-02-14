import React from 'react'
import { Box } from '@mui/material'
import { onlineListStores } from '../../store'
import OnlineList from '../OnlineList/OnlineList'
import { setCurrentVerse, setNextVerseCurrent, setPreviousVerseCurrent } from '../../store/verses/versesAPI'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import VerseAutocomplete from './VerseAutocomplete'
import useObtainHistoryVerse from './useObtainHistoryVerse'
import { useHotkeys } from '../../utils/hooks/useHotkeys'
import { supabaseAPI } from '../../supabase/supabaseAPI'

const VerseList = () => {
  const shownVerseId = useAppSelector(state => state.shown.currentVerseId)
  const historyVerse = useObtainHistoryVerse()

  const dispatch = useAppDispatch()

  const anyModalOpen = useAppSelector(state => state.hotkeysBlock.isBlocked)
  useHotkeys({
    ArrowUp: (e) => {dispatch(setPreviousVerseCurrent())},
    ArrowDown: (e) => {dispatch(setNextVerseCurrent())},
    Enter: (e) => {
      supabaseAPI.showVerse(historyVerse, dispatch)
    },
    Escape: (e) => {
      supabaseAPI.showVerse(null, dispatch)
    }
  }, anyModalOpen)

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
      <VerseAutocomplete />
      <OnlineList
        reduxStoreName={onlineListStores.verses}
        shownItemId={shownVerseId}
        onClick={item => dispatch(setCurrentVerse(item.id))}
        onDoubleClick={item => {
          if (!historyVerse || shownVerseId === item.id) {
            supabaseAPI.showVerse(null, dispatch)
            return
          }
          supabaseAPI.showVerse({ ...historyVerse, verseId: item.id }, dispatch)
        }}
      />
    </Box>
  )
}

export default VerseList