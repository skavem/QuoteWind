import * as Yup from 'yup'
import { Abc, Close, Percent } from '@mui/icons-material'
import { Box, Button, IconButton, InputAdornment, Modal, Paper, Typography } from '@mui/material'
import { Field, Formik, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import AddParameters from '../../../types/AddParameters'
import useSongModal from '../useSongModal'
import { CenteredModalBox } from '../../StyledMUI'
import { PostgrestError } from '@supabase/supabase-js'
import { QrStyles, supabaseAPI, useSupabaseQr } from '../../../supabase/supabaseAPI'
import useQrModal from './useQrModal'
import { MuiColorInput } from 'mui-color-input'

const SongSchema = Yup.object().shape({
  data: Yup.string()
    .required('Необходимо заполнить'),
  size: Yup.number()
    .typeError('Должно быть десятичным числом с точкой после целых')
    .required('Необходимо заполнить')
    .lessThan(51, 'Не стоит делать QR больше чем на половину экрана')
    .moreThan(19, 'Не стоит делать QR меньше 20%'),
  bgColor: Yup.string()
    .required('Необходимо заполнить'),
  fgColor: Yup.string()
    .required('Необходимо заполнить'),
})

type IOnQrFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<QrStyles>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useSongModal>['handleModalClose']]
>

const errCodes = [
  ['23505', 'Ошибка 23505']
]
  

const onQrFormSubmit: IOnQrFormSubmit = async (
  values, 
  actions, 
  enqueueSnackbar,
  handleModalClose
) => {
  const handleError = (error: PostgrestError | null) => {
    if (!error) return
    const errorMessage = errCodes.find(errorCd => errorCd[0] === error.code)
    enqueueSnackbar(errorMessage ? errorMessage[1] : error.message, {
      variant: 'error',
      anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
    })
    actions.setSubmitting(false)
  }

  const { error } = await supabaseAPI.setQrStyles(values)
  handleError(error)

  actions.setSubmitting(false)
  handleModalClose()
}

const QrModal = ({
  enqueueSnackbar,
  handleModalClose,
  handleModalOpen,
  curState,
  modalOpen,
  theme
}: ReturnType<typeof useQrModal> & { curState: ReturnType<typeof useSupabaseQr>['qrStyles'] }) => {
  return (
    <Modal open={modalOpen} onClose={handleModalClose} >
      <CenteredModalBox>
        <Paper elevation={1} sx={{minWidth: '600px'}} >
          <Box 
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              padding: theme.spacing(1, 2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='h6' component='h2' textAlign={'center'}>
              Параметры QR-кода
            </Typography>
            <IconButton 
              sx={{ color: theme.palette.primary.contrastText }}
              onClick={handleModalClose}
            >
              <Close />
            </IconButton>
          </Box>
          <Box padding={2}>
            <Formik
              initialValues={curState}
              onSubmit={
                (values, actions) => {
                  onQrFormSubmit(
                    values, 
                    actions, 
                    enqueueSnackbar,
                    handleModalClose
                  )
                }
              }
              validationSchema={SongSchema}
            >
              {({ submitForm, values, setFieldValue, errors }) => (
                <Box 
                  display={'flex'}
                  flexDirection={'column'} 
                  gap={1}
                  onKeyUp={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      submitForm()
                      e.stopPropagation()
                    }
                  }}
                >
                  <Field
                    component={TextField}
                    name="data"
                    label="Текст QR"
                    size='small'
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Abc />
                        </InputAdornment>
                      ) 
                    }}
                  />
                  <Field
                    component={TextField}
                    name="size"
                    label="Размер"
                    size='small'
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Percent />
                        </InputAdornment>
                      ) 
                    }}
                  />
                  <MuiColorInput
                    size='small'
                    variant='filled'
                    label='Основной цвет'
                    name='fgColor'
                    value={values.fgColor ?? '#ffffffff'}
                    onInput={console.log}
                    onChange={(_, colors) => {
                      setFieldValue('fgColor', colors.hex8)
                    }}
                    error={!!errors.fgColor}
                    helperText={errors.fgColor}
                    format={'hex8'}
                  />
                  <MuiColorInput
                    size='small'
                    variant='filled'
                    label='Цвет фона'
                    name='bgColor'
                    value={values.bgColor ?? '#ffffffff'}
                    onInput={console.log}
                    onChange={(_, colors) => {
                      setFieldValue('bgColor', colors.hex8)
                    }}
                    error={!!errors.bgColor}
                    helperText={errors.bgColor}
                    format={'hex8'}
                  />
                  <Box display={'flex'} gap={1} justifyContent={'flex-end'} marginTop={2}>
                    <Button
                      title='Сохранить (ctrl + enter)'
                      variant="contained"
                      color="secondary"
                      onClick={submitForm}
                    >
                      Сохранить
                    </Button>
                    <Button
                      title='Отменить (esc)'
                      variant='outlined'
                      onClick={handleModalClose}
                    >
                      Отменить
                    </Button>
                  </Box>
                </Box>
              )}
            </Formik>
          </Box>
        </Paper>
      </CenteredModalBox>
    </Modal>
  )
}

export default QrModal