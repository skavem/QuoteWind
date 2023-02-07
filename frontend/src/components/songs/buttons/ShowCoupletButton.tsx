import { useCallback, useRef, useState } from 'react'
import { Button, ButtonGroup, ClickAwayListener, Grow, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material'
import { ArrowDropDown, Brush, Comment, CommentsDisabled, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { onlineListStores } from '../../../store'
import { SupabaseReduxAPI } from '../../../supabase/supabaseReduxAPI'
import useObtainHistoryVerse from '../../verses/useObtainHistoryVerse'
import useCoupletStylesModal from './useCoupletStylesModal'
import { useSupabaseCoupletStyles } from '../../../supabase/supabaseAPI'
import CoupletStylesModal from './CoupletStylesModal'

const ShowCurrentCoupletButton = () => {
  const currentCoupletId = useAppSelector(state => state[onlineListStores.couplets].currentId)
  const shownCoupletId = useAppSelector(state => state.shown.currentCoupletId)
  const shownSelected = currentCoupletId === shownCoupletId

  const coupletStylesModalProps = useCoupletStylesModal()
  const coupletStyles = useSupabaseCoupletStyles()

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
          startIcon={shownSelected ? <VisibilityOff /> : <Visibility />}
          onClick={() => {
            SupabaseReduxAPI.showCouplet(shownSelected ? null : currentCoupletId)
          }}
        >
          {shownSelected ? 'Спрятать' : 'Показать'}
        </Button>
        <Button
          size='small'
          onClick={() => coupletStylesModalProps.handleModalOpen()}
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
        curState={coupletStyles.coupletStyles}
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
                      SupabaseReduxAPI.showCouplet(shownCoupletId ? null : currentCoupletId)
                      handleCloseMenu()
                    }}
                  >
                    <ListItemIcon>
                      {shownCoupletId ? <VisibilityOff /> : <Visibility />}
                    </ListItemIcon>
                    <ListItemText>
                      {shownCoupletId ? 'Спрятать отображаемый' : 'Показать выбранный'}
                    </ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      SupabaseReduxAPI.showVerse(shownVerseId ? null : historyVerse, dispatch)
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

export default ShowCurrentCoupletButton