import { Brush, QrCode } from '@mui/icons-material'
import { Button, ButtonGroup } from '@mui/material'
import { useAppSelector } from '../../../store/hooks'
import { defaultStyles } from '../../../store/shown/shownReducer'
import { supabaseAPI } from '../../../supabase/supabaseAPI'
import useModalForm from '../../ModalForm/useModalForm'
import QrModal from './QrModal'

const ToggleQrButton = () => {
  const qrStyles = useAppSelector(state => state.shown.styles?.qr)
  const modalProps = useModalForm()

  return (
    <>
      <ButtonGroup
        size='small'
        color='primary'
        variant='outlined'
      >
        <Button
          onClick={() => supabaseAPI.setQrStyles(
            qrStyles?.shown ? { shown: false } : { shown: true }
          )}
        >
          <QrCode sx={(theme) => ({
            color: qrStyles?.shown ? 'primary' : theme.palette.grey[500]
          })} />
        </Button>
        <Button onClick={() => modalProps.handleOpen()}>
          <Brush />
        </Button>
      </ButtonGroup>
      <QrModal {...modalProps} curState={qrStyles ?? defaultStyles.qr} />
    </>
  )
}

export default ToggleQrButton