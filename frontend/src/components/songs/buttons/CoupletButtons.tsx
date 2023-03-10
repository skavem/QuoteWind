import { useCallback, useRef, useState } from 'react'
import { Button, ButtonGroup, ClickAwayListener, Grow, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import { ArrowDropDown, Brush, Comment, CommentsDisabled, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { onlineListStores } from '../../../store'
import useObtainHistoryVerse from '../../verses/useObtainHistoryVerse'
import CoupletStylesModal from './CoupletStylesModal'
import useModalForm from '../../ModalForm/useModalForm'
import { defaultStyles } from '../../../store/shown/shownReducer'
import { supabaseAPI } from '../../../supabase/supabaseAPI'

const CoupletButtons = () => {
  const currentCoupletId = useAppSelector(state => state[onlineListStores.couplets].currentId)
  const shownCoupletId = useAppSelector(state => state.shown.currentCoupletId)
  const shownSelected = currentCoupletId === shownCoupletId

  const coupletStylesModalProps = useModalForm()
  const coupletStyles = useAppSelector(state => state.shown.styles?.couplet)

  const shownVerseId = useAppSelector(state => state.shown.currentVerseId)
  const historyVerse = useObtainHistoryVerse()
  const dispatch = useAppDispatch()

  const anchorRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const handleOpenMenu = useCallback(() => {
    setMenuOpen(true)
  }, [setMenuOpen])
  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false)
  }, [setMenuOpen])

  return (
    <>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button
          variant='contained'
          startIcon={shownCoupletId ? <VisibilityOff /> : <Visibility />}
          onClick={() => {
            supabaseAPI.showCouplet(shownCoupletId ? null : currentCoupletId)
          }}
        >
          {shownCoupletId ? 'Спрятать' : 'Показать'}
        </Button>
        <Button
          size='small'
          onClick={() => coupletStylesModalProps.handleOpen()}
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

      <CoupletStylesModal 
        {...coupletStylesModalProps} 
        curState={coupletStyles ?? defaultStyles.couplet}
      />

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
                      supabaseAPI.showCouplet(shownSelected ? null : currentCoupletId)
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
                      supabaseAPI.showVerse(shownVerseId ? null : historyVerse, dispatch)
                      handleCloseMenu()
                    }}
                  >
                    <ListItemIcon>
                      {shownVerseId ? <CommentsDisabled /> : <Comment />}
                    </ListItemIcon>
                    <ListItemText>
                      {shownVerseId ? 'Спрятать стих' : 'Показать стих'}
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

export default CoupletButtons