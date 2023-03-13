import { useRef, useState, useCallback } from 'react'
import { Button, ButtonGroup, ClickAwayListener, Grow, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import { ArrowDropDown, Brush, Piano, PianoOff, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { onlineListStores } from '../../../store'
import useObtainHistoryVerse from '../useObtainHistoryVerse'
import VerseStylesModal from './VerseStylesModal'
import useModalForm from '../../ModalForm/useModalForm'
import { defaultStyles } from '../../../store/shown/shownReducer'
import { supabaseAPI } from '../../../supabase/supabaseAPI'

const ShowVerseButton = () => {
  const { currentId: currentVerseId } = useAppSelector(state => state[onlineListStores.verses])
  const shownVerseId = useAppSelector(state => state.shown.currentVerseId)
  const shownSelected = currentVerseId === shownVerseId

  const currentCoupletId = useAppSelector(state => state[onlineListStores.couplets].currentId)
  const shownCoupletId = useAppSelector(state => state.shown.currentCoupletId)

  const stylesModalProps = useModalForm()
  const verseStyles = useAppSelector(state => state.shown.styles?.verse)

  const anchorRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const handleOpenMenu = useCallback(() => {
    setMenuOpen(true)
  }, [setMenuOpen])
  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false)
  }, [setMenuOpen])

  const historyVerse = useObtainHistoryVerse()

  const dispatch = useAppDispatch()

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button 
          variant='contained'
          startIcon={shownVerseId ? <VisibilityOff /> : <Visibility />}
          onClick={() => {
            supabaseAPI.showVerse(shownVerseId ? null : historyVerse, dispatch)
          }}
        >
          {shownVerseId ? 'Спрятать' : 'Показать'}
        </Button>
        <Button
          size='small'
          onClick={() => stylesModalProps.handleOpen()}
        >
          <Brush />
        </Button>
        <Button
          size="small"
          aria-controls={menuOpen ? 'split-button-menu' : undefined}
          aria-expanded={menuOpen ? 'true' : undefined}
          aria-label="опции скрытия/отображения"
          aria-haspopup="menu"
          onClick={handleOpenMenu}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <VerseStylesModal {...stylesModalProps} curState={verseStyles ?? defaultStyles.verse} />
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={menuOpen}
        anchorEl={anchorRef.current}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper sx={{minWidth: '200px'}}>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList id="split-button-menu" dense>
                  <MenuItem
                    onClick={() => {
                      supabaseAPI.showVerse(shownSelected ? null : historyVerse, dispatch)
                      handleCloseMenu()
                    }}
                  >
                    <ListItemIcon>
                      {shownSelected ? <VisibilityOff /> : <Visibility />}
                    </ListItemIcon>
                    <ListItemText>
                      {shownSelected ? 'Спрятать выбранный' : 'Показать выбранный'}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      supabaseAPI.showCouplet(shownCoupletId ? null : currentCoupletId)
                      handleCloseMenu()
                    }}
                  >
                    <ListItemIcon>
                      {shownCoupletId ? <PianoOff /> : <Piano />}
                    </ListItemIcon>
                    <ListItemText>
                      {shownCoupletId ? 'Спрятать куплет' : 'Показать куплет'}
                    </ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default ShowVerseButton