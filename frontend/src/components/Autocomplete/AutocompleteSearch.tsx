import { useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import useDebounce from '../../utils/hooks/useDebounce'
import { AutocompleteOption } from '../Autocomplete/AutocompleteOption'
import { setHotkeysBlocked } from '../../store/hotkeysBlockReducer'
import { useAppDispatch } from '../../store/hooks'

const findAndSetOptions = async <T,>(
  input: string, 
  setOptions: (options: T[]) => void,
  searchFn: (input: string) => Promise<T[]>
) => {
  let options: T[] = []

  options = await searchFn(input)

  setOptions(options)
}

type AutocompleteSearchProps<T> = {
  textfieldLabel: string,
  searchFn: (input: string) => Promise<T[]>,
  setCurrentFn: (value: T) => void
}

const AutocompleteSearch = <T extends {id: number, data: string},>({
  textfieldLabel,
  searchFn,
  setCurrentFn
}: AutocompleteSearchProps<T>) => {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<readonly T[]>([])
  const debouncedInput = useDebounce(input, 100)

  const dispatch = useAppDispatch()

  useEffect(() => {
    findAndSetOptions(debouncedInput, setOptions, searchFn)
  }, [debouncedInput, searchFn])

  return (
    <Autocomplete 
      onFocus={() => dispatch(setHotkeysBlocked(true))}
      onBlur={() => dispatch(setHotkeysBlocked(false))}
      size={'small'}
      options={options}
      noOptionsText='Ничего не найдено или слишком короткая строка'
      inputValue={input}
      onInputChange={(_, value) => setInput(value)}
      filterOptions={x => x}
      isOptionEqualToValue={(o, v) => o.id === v.id}
      getOptionLabel={o => o.data}
      slotProps={{
        popper: {sx: {
          border: '1px solid black',
          boxShadow: '1px 1px 7px black, -1px -1px 7px black'
        }}
      }}
      renderInput={(params) => 
        <TextField
          {...params}
          label={textfieldLabel}
        />
      }
      renderOption={(props, option) => (
        <AutocompleteOption {...props} option={option} key={option.id}/>
      )}
      sx={{ width: '100%' }}
      onChange={(_, value) => {
        if (value?.id) {
          setCurrentFn(value)
        }
      }}
    />
  )
}

export default AutocompleteSearch