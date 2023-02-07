import React from 'react'
import { useAppDispatch } from '../../../store/hooks'
import { setCurrentSong } from '../../../store/songs/songsAPI'
import { supabase } from '../../../supabase'
import AutocompleteSearch from '../../Autocomplete/AutocompleteSearch'



const findCouplets = async (input: string) => {
  if (input.length < 3) return []

  const { data: couplets } = await supabase
    .from('Couplet')
    .select()
    .textSearch('fts', input, { config: 'russian', type: 'websearch' })
    .range(0, 20)

  if (couplets) {
    return couplets.map(couplet => ({
      id: couplet.id,
      data: couplet.text ?? '',
      mark: couplet.song_id,
      songId: couplet.song_id
    }))
  }

  return []
}

const CoupletAutcomplete = () => {
  const dispatch = useAppDispatch()

  return (
    <AutocompleteSearch
      searchFn={findCouplets}
      setCurrentFn={value => dispatch(setCurrentSong(value.songId, value.id))}
      textfieldLabel={'Куплет'}
    />
  )
}

export default CoupletAutcomplete