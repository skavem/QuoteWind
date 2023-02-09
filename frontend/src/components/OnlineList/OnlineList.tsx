import React, { useEffect, useRef } from 'react'
import { Box, styled } from '@mui/material'
import { onlineListStores, RootState } from '../../store'
import { useAppSelector } from '../../store/hooks'
import OnlineListItem from './OnlineListItem'

const OnlineListBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1),
  borderColor: theme.palette.action.disabled,
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: theme.shape.borderRadius,
  overflowX: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  width: '100%',
  userSelect: 'none',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '0.2em'
  },
  '&::-webkit-scrollbar-track': {
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.light,
    outline: '1px solid '+theme.palette.primary.dark,
    borderRadius: theme.shape.borderRadius
  },
  '&:hover': {
    borderColor: theme.palette.action.active
  }
}))

interface onlineListProps <T extends onlineListStores> {
  reduxStoreName: T,
  onClick: (item: RootState[T]['items'][0]) => void,
  onDoubleClick?: (item: RootState[T]['items'][0]) => void,
  onItemContextMenu?: (
    e: React.MouseEvent<HTMLElement>,
    item: RootState[T]['items'][0]
  ) => void,
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void,
  shownItemId?: RootState[T]['items'][0]['id'] | null,
  getMark?: (item: RootState[T]['items'][0]) => string | undefined,
  itemsOnPage?: number,
  page?: number,
  dividerBefore?: (item: RootState[T]['items'][0]) => string | null
}

const OnlineList = <T extends onlineListStores,>({
  reduxStoreName, onClick, shownItemId, itemsOnPage, page, dividerBefore,
  onDoubleClick = () => {},
  onItemContextMenu = () => {},
  onContextMenu = () => {},
  getMark = (item) => item.mark
}: onlineListProps<T>) => {
  let items = useAppSelector(state => state[reduxStoreName].items)
  const currentId = useAppSelector(state => state[reduxStoreName].currentId)
  
  if (itemsOnPage && page) {
    items = items.slice(itemsOnPage * (page - 1), itemsOnPage * page)
  }

  const activeRef = useRef<HTMLElement>(null)
  const boxRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (activeRef.current && boxRef.current) {
      const active = activeRef.current
      const box = boxRef.current
      const activeRect = active.getBoundingClientRect()
      const boxRect = box.getBoundingClientRect()

      if (activeRect.bottom > boxRect.bottom || activeRect.top < boxRect.top) {
        active.scrollIntoView({ block: 'center' })
      }
    }
  }, [currentId])
  
  return (
    <OnlineListBox ref={boxRef} onContextMenu={onContextMenu}>
      {items.map(item => (
        <OnlineListItem 
          key={item.id}
          item={item}
          active={item.id === currentId}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onContextMenu={onItemContextMenu}
          shown={item.id === shownItemId}
          getMark={getMark}
          activeRef={item.id === currentId ? activeRef : null}
          dividerBefore={dividerBefore}
        />
      ))}
    </OnlineListBox>
  )
}

export default OnlineList