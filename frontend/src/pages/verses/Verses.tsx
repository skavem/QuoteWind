import { Grid, Box, Stack } from '@mui/material'
import ShowVerseButton from '../../components/verses/buttons/VerseButtons'
import BookList from '../../components/verses/BookList'
import ChapterList from '../../components/verses/ChapterList'
import VerseList from '../../components/verses/VerseList'
import VerseHistoryList from '../../components/verses/verseHistory/VerseHistoryList'

const Bible = () => {
  return (
    <Grid direction='column' container height='100%'>
      <Grid item flexGrow={1} container spacing={2} columns={12} direction='row' minHeight='0'>
        <Grid item xs={3} md={2} height='100%'>
          <BookList />
        </Grid>
        <Grid item xs={9} md={10} height='100%' display='flex' flexDirection='column' flexWrap='nowrap'>
          <Stack
            flex='0 0 60%'
            minHeight={0} 
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Box flex='0 0 115px' height='100%'>
              <ChapterList />
            </Box>
            <Box flexGrow={1} height='100%'>
              <VerseList />
            </Box>
          </Stack>
          <Grid container justifyContent='center' margin={1} maxWidth='100%' gap={1}>
            <ShowVerseButton />
          </Grid>
          <Box flex='1 1' minHeight={0}>
            <VerseHistoryList />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Bible