import { Autocomplete, TextField, Box, createFilterOptions } from '@mui/material'
import { onlineListStores } from '../../store'
import OnlineList from '../OnlineList/OnlineList'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCurrentChapter } from '../../store/chapters/chaptersAPI'
import { setHotkeysBlocked } from '../../store/hotkeysBlockReducer'

const ChapterList = () => {
  const chapters = useAppSelector(state => state[onlineListStores.chapters].items)
  const dispatch = useAppDispatch()

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
      <Autocomplete
        onFocus={() => dispatch(setHotkeysBlocked(true))}
        onBlur={() => dispatch(setHotkeysBlocked(false))}
        size='small'
        renderInput={(params) => <TextField {...params} label="Глава" tabIndex={2}/>}
        options={chapters}
        getOptionLabel={option => option.data}
        filterOptions={createFilterOptions({
          stringify(option) {
            return `${option.data}`
          },
        })}
        slotProps={{
          popper: {sx: {
            border: '1px solid black',
            boxShadow: '1px 1px 7px black, -1px -1px 7px black'
          }}
        }}
        onChange={(_, value) => {
          if (value) dispatch(setCurrentChapter(value.id))
        }}
      />
      <OnlineList
        reduxStoreName={onlineListStores.chapters}
        onClick={item => dispatch(setCurrentChapter(item.id))}
      />
    </Box>
  )
}

export default ChapterList