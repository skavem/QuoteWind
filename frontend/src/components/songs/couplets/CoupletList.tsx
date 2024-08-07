import { useEffect } from 'react'
import { Box } from '@mui/material'
import { onlineListStores, RootState } from '../../../store'
import { deleteCouplet, setCouplets, setCurrentCouplet, setNextCoupletCurrent, setPreviousCoupletCurrent } from '../../../store/couplets/coupletsAPI'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import OnlineList from '../../OnlineList/OnlineList'
import CoupletAutcomplete from './CoupletAutcomplete'
import CoupletModal from '../songs/CoupletModal'
import useCoupletModal from '../useCoupletModal'
import OnlineListMenu from '../songs/OnlineListMenu'
import useContextMenuWithItem from '../../../utils/hooks/useContextMenuWithItem'
import { ContentCopy, Delete, Edit, PlaylistAdd, VerticalAlignBottom, VerticalAlignTop } from '@mui/icons-material'
import { supabase } from '../../../supabase'
import copyToClipboard from '../../../utils/copyToClipboardPolyfill'
import { useHotkeys } from '../../../utils/hooks/useHotkeys'
import { DBTables } from '../../../types/supabase-extended'
import { supabaseAPI } from '../../../supabase/supabaseAPI'

const CoupletList = () => {
  const shownCoupletId = useAppSelector(state => state.shown.currentCoupletId)
  const couplets = useAppSelector(state => state[onlineListStores.couplets].items)
  const currentCoupletId = useAppSelector(state => state[onlineListStores.couplets].currentId)

  const dispatch = useAppDispatch()
  const songId = useAppSelector(state => state[onlineListStores.songs].currentId)
  useEffect(() => {
    const subscription = supabase
      .channel('public:Couplet')
      .on<DBTables['Couplet']['Row']>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Couplet',
          filter: `song_id=eq.${songId}`
        },
        payload => {
          switch (payload.eventType) {
            case 'DELETE':
              dispatch(deleteCouplet(payload.old.id!))
              break
            case 'INSERT':
            case 'UPDATE':
              supabase.from('Couplet').select().eq('song_id', songId).then(couplets => {
                if (couplets.data)
                dispatch(setCouplets(couplets.data))
              })
              break
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [songId, dispatch])

  const menuProps = useContextMenuWithItem<RootState[onlineListStores.couplets]['items'][0]>()

  const modalProps = useCoupletModal()

  const anyModalOpen = useAppSelector(state => state.hotkeysBlock.isBlocked)
  useHotkeys({
    ArrowUp: (e) => {dispatch(setPreviousCoupletCurrent())},
    ArrowDown: (e) => {dispatch(setNextCoupletCurrent())},
    Enter: (e) => {
      supabaseAPI.showCouplet(currentCoupletId)
    },
    Escape: (e) => {
      supabaseAPI.showCouplet(null)
    }
  }, anyModalOpen)

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={1}
      alignItems='center'
      height={'60%'}
    >
      <CoupletAutcomplete />

      <OnlineList 
        reduxStoreName={onlineListStores.couplets}
        onClick={item => dispatch(setCurrentCouplet(item.id))}
        shownItemId={shownCoupletId}
        onDoubleClick={item => supabaseAPI.showCouplet(
          item.id === shownCoupletId ? null : item.id
        )}
        onItemContextMenu={menuProps.handleContextMenu}
        onContextMenu={(e) => menuProps.handleContextMenu(e, null)}
      />

      <CoupletModal {...modalProps} />

      <OnlineListMenu
        {...menuProps}
        actions={[
          {
            icon: ContentCopy,
            text: 'Копировать текст',
            async onClick(item) {
              if (item)
              await copyToClipboard(item.data)
            },
            shown: item => !!item,
            dividerAfter: true
          },
          {
            icon: Edit,
            text: 'Изменить',
            async onClick(item) {
              modalProps.handleOpen(item, songId!)
            },
            shown: item => !!item
          },
          {
            icon: Delete,
            text: 'Удалить',
            async onClick(item) {
              if (item)
              await supabase.from('Couplet').delete().eq('id', item.id)
              await supabaseAPI.rearrangeCouplets(songId!)
            },
            dividerAfter: true,
            shown: item => !!item
          },
          {
            icon: VerticalAlignTop,
            text: 'Добавить перед',
            async onClick(item) {
              if (item) {
                const indexAfter = couplets.findIndex(couplet => couplet.id === item.id) + 1
                modalProps.handleOpen(null, songId!, indexAfter)
              }
            },
            shown: item => !!item
          },
          {
            icon: VerticalAlignBottom,
            text: 'Добавить после',
            async onClick(item) {
              if (item) {
                const indexAfter = couplets.findIndex(couplet => couplet.id === item.id) + 2
                modalProps.handleOpen(null, songId!, indexAfter)
              }
            },
            shown: item => !!item,
            dividerAfter: true
          },
          {
            icon: PlaylistAdd,
            text: 'Добавить в конец',
            async onClick(item) {
              modalProps.handleOpen(null, songId!)
            }
          }
        ]}
      />
    </Box>
  )
}

export default CoupletList