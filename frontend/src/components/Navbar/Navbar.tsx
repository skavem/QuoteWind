import { 
  AppBar,
  styled,
  Toolbar,
  Typography,
  Box,
  Divider
} from '@mui/material'
import pageList from '../../pages'
import PageTabs from './PageTabs'
import { Air } from '@mui/icons-material'

const AppName = styled(Typography)({
  fontFamily: 'monospace',
  fontWeight: 400,
  letterSpacing: '.1rem',
  color: 'inherit',
  textDecoration: 'none',
}) as typeof Typography

const IconDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1),
  width: theme.spacing(0.1),
}))

const AppNameBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  alignItems: 'center'
})

const Navbar = () => {
  return (
    <AppBar position="static" >
      <Box marginLeft={2} marginRight={2}>
        <Toolbar disableGutters>
          <AppNameBox>
            <Air sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }} />
            <IconDivider orientation='vertical' flexItem sx={{display: { xs: 'none', sm: 'block' }}} variant={'middle'} />
            <AppName component={'h1'} variant='h6'>
              QuoteWind
            </AppName>
          </AppNameBox>

          <Box justifyContent='center' alignItems='center' display='flex' flexGrow={1}>
            <PageTabs pages={pageList}/>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}

export default Navbar