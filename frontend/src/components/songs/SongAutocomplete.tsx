import { DBTables } from '../../types/supabase'
import { supabase } from '../../supabase'
import { useAppDispatch } from '../../store/hooks'
import { setCurrentSong } from '../../store/songs/songsAPI'
import AutocompleteSearch from '../Autocomplete/AutocompleteSearch'

type SearchedSong = {
  id: DBTables['Song']['Row']['id'],
  data: DBTables['Song']['Row']['name'],
  mark: DBTables['Song']['Row']['label']
}

const searchSongs = async (
  input: string
) => {
  let songs: SearchedSong[] = []

  if (/^\d+$/gi.test(input)) {
    const { data: foundSongs } = await supabase
      .from('Song')
      .select()
      .eq('label', input)
    if (foundSongs) {
      songs = foundSongs.map(song => ({id: song.id, data: song.name, mark: song.label}))
    }
  } else {
    if (input.length < 3) {
      return []
    }
    const { data: foundSongs } = await supabase
      .from('Song')
      .select()
      .textSearch('fts', input, {config: 'russian', type: 'websearch'})
    if (foundSongs) {
      songs = foundSongs.map(song => ({id: song.id, data: song.name, mark: song.label}))
    }
  }

  return songs
}

const SongAutocomplete = () => {
  const dispatch = useAppDispatch()

  return (
    <AutocompleteSearch 
      searchFn={searchSongs}
      setCurrentFn={(value) => dispatch(setCurrentSong(value.id))}
      textfieldLabel={'Название или номер песни'}
    />
  )
}

export default SongAutocomplete