import { Autocomplete, TextField, Box, createFilterOptions } from '@mui/material'
import { onlineListStores } from '../../store'
import { setCurrentBook } from '../../store/books/booksApi'
import OnlineList from '../OnlineList/OnlineList'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setHotkeysBlocked } from '../../store/hotkeysBlockReducer'

const BookList = () => {
  const books = useAppSelector(state => state[onlineListStores.books].items)
  const dispatch = useAppDispatch()

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
      <Autocomplete
        onFocus={() => dispatch(setHotkeysBlocked(true))}
        onBlur={() => dispatch(setHotkeysBlocked(false))}
        size='small'
        renderInput={(params) => <TextField {...params} label="Книга" tabIndex={1}/>}
        options={books}
        getOptionLabel={option => option.data}
        filterOptions={createFilterOptions({
          stringify(option) {
            return `${option.mark}, ${option.data}`
          },
        })}
        slotProps={{
          popper: {sx: {
            border: '1px solid black',
            boxShadow: '1px 1px 7px black, -1px -1px 7px black'
          }}
        }}
        onChange={(_, value) => {
          if (value) dispatch(setCurrentBook(value.id))
        }}
      />
      <OnlineList 
        reduxStoreName={onlineListStores.books}
        onClick={item => dispatch(setCurrentBook(item.id))}
        getMark={_ => undefined}
        dividerBefore={item => item.part}
      />
    </Box>
  )
}

export default BookList