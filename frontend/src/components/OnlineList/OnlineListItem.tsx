import React, { RefObject } from 'react'
import { Box, Typography, styled, Divider } from '@mui/material'
import { Visibility } from '@mui/icons-material'
import theme from '../../theme'
import { onlineListStores, RootState } from '../../store'

const ItemBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.2, 0.5),
  margin: theme.spacing(0.5, 0),
  '&:hover': {
    backgroundColor: theme.palette.action.selected
  },
  cursor: 'pointer',
}))

export const ItemMark = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 0.5, 0, 0),
  display: 'inline-block',
  color: theme.palette.secondary.contrastText,
  backgroundColor: theme.palette.secondary.main,
  padding: theme.spacing(0.25, 0.8, 0.25, 0.75),
  borderRadius: theme.shape.borderRadius
}))

interface OnlineListItemProps <T extends onlineListStores> {
  item: RootState[T]['items'][0],
  active: boolean,
  shown?: boolean,
  onClick?: (item: RootState[T]['items'][0]) => void,
  onDoubleClick?: (item: RootState[T]['items'][0]) => void,
  onContextMenu?: (e: React.MouseEvent<HTMLElement>, item: RootState[T]['items'][0]) => void,
  getMark?: (item: RootState[T]['items'][0]) => string | undefined,
  activeRef?: RefObject<HTMLElement> | null,
  dividerBefore?: (item: RootState[T]['items'][0]) => string | null
}

const OnlineListItem = ({ 
  item, active, shown, activeRef, dividerBefore,
  getMark = (item) => item.mark ?? '',
  onClick = () => {},
  onDoubleClick = () => {},
  onContextMenu = () => {}
}: OnlineListItemProps<onlineListStores>) => {
  const mark = getMark(item)
  const divider = dividerBefore ? dividerBefore(item) : null
  return (
    <>
      {divider ? (<Divider>{divider}</Divider>) : (<></>)}
      <ItemBox 
        sx={{outline: (theme) => active ? `2px solid ${theme.palette.action.active}` : ''}}
        onClick={() => onClick(item)}
        onDoubleClick={() => onDoubleClick(item)}
        onContextMenu={e => onContextMenu(e, item)}
        ref={activeRef}
      >
        {
          shown && 
          <Visibility 
            sx={{
              verticalAlign: 'middle',
              padding: theme.spacing(0, 0.25, 0, 0),
              mr: theme.spacing(0.125),
              height: 'auto'
            }}
          />
        }
        {
          mark &&
          <ItemMark variant='body2'>{mark}</ItemMark>
        }
        <Typography variant='body1' display='inline'>{item.data}</Typography>
      </ItemBox>
    </>
  )
}

export default OnlineListItem