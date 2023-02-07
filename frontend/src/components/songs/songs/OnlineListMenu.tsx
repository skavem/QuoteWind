import React from 'react'
import { SvgIconComponent } from '@mui/icons-material'
import { Box, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'

type OnlineListMenuProps<T> = ReturnType<typeof useContextMenuWithItem<T>>
  & { 
      actions?: {
        onClick: (item: T | null) => Promise<void>,
        icon: SvgIconComponent,
        text: string,
        dividerAfter?: boolean,
        shown?: (item: T | null) => boolean
      }[]
    }

const OnlineListMenu = <T,>({
  contextMenu,
  handleClose,
  actions
}: OnlineListMenuProps<T>) => {
  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? contextMenu.position
          : undefined
      }
      PaperProps={{ sx: { minWidth: '200px' } }}
    >
      {actions && actions.map(action => (
        <Box
          key={action.text + action.icon.muiName}
          display={
            !action.shown || action.shown(contextMenu ? contextMenu.item : null)
            ? 'block' 
            : 'none'
          }
        >
          <MenuItem 
            dense 
            onClick={async () => {
              if (contextMenu?.item) {
                const item = contextMenu.item
                await action.onClick(item)
              } else {
                await action.onClick(null)
              }
              handleClose()
            }}
            sx={{ '&:hover': { backgroundColor: (theme) => theme.palette.action.hover } }}
          >
            <ListItemIcon>
              <action.icon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>{action.text}</ListItemText>
          </MenuItem>
          {action.dividerAfter && <Divider />}
        </Box>
      ))}
    </Menu>
  )
}

export default OnlineListMenu