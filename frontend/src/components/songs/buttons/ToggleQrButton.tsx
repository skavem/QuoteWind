import { Brush, QrCode } from '@mui/icons-material'
import { Button, ButtonGroup } from '@mui/material'
import { supabaseAPI, useSupabaseQr } from '../../../supabase/supabaseAPI'
import QrModal from './QrModal'
import useQrModal from './useQrModal'

const ToggleQrButton = () => {
  const { qrShown, qrStyles } = useSupabaseQr()
  const modalProps = useQrModal()

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
        <Button onClick={() => modalProps.handleModalOpen()}>
          <Brush />
        </Button>
      </ButtonGroup>
      <QrModal {...modalProps} curState={qrStyles} />
    </>
  )
}

export default ToggleQrButton