import { Brush, QrCode } from '@mui/icons-material'
import { Button, ButtonGroup } from '@mui/material'
import { supabaseAPI, useSupabaseQr } from '../../../supabase/supabaseAPI'
import useModalForm from '../../ModalForm/useModalForm'
import QrModal from './QrModal'

const ToggleQrButton = () => {
  const { qrShown, qrStyles } = useSupabaseQr()
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
            qrShown ? { shown: false } : { shown: true }
          )}
        >
          <QrCode sx={(theme) => ({
            color: qrShown ? 'primary' : theme.palette.grey[500]
          })} />
        </Button>
        <Button onClick={() => modalProps.handleOpen()}>
          <Brush />
        </Button>
      </ButtonGroup>
      <QrModal {...modalProps} curState={qrStyles} />
    </>
  )
}

export default ToggleQrButton