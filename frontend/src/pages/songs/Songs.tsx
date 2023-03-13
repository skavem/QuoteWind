import { Grid } from '@mui/material'
import CoupletList from '../../components/songs/couplets/CoupletList'
import CurrentCoupletButton from '../../components/songs/buttons/CoupletButtons'
import SongFavorites from '../../components/songs/songFavorites/SongFavorites'
import SongsList from '../../components/songs/songs/SongList'
import ToggleQrButton from '../../components/songs/buttons/ToggleQrButton'

const Songs = () => {
  return (
    <Grid container direction={'column'} height={'100%'}>
      <Grid container item flexGrow={1} direction={'row'} spacing={2} minHeight='0'>
        <Grid item xs={4} md={3} height={'100%'} width={'100%'}>
          <SongsList />
        </Grid>

        <Grid item xs={8} md={9} container height={'100%'} flexDirection={'column'} gap={1} flexWrap={'nowrap'}>
          <CoupletList />
          <Grid container justifyContent='center' maxWidth='100%' gap={1}>
            <CurrentCoupletButton />
            <ToggleQrButton />
          </Grid>
          <SongFavorites />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Songs