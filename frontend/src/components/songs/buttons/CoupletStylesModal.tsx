import * as Yup from 'yup'
import { Close, FormatLineSpacing } from '@mui/icons-material'
import { Box, Button, IconButton, InputAdornment, Modal, Paper, Typography } from '@mui/material'
import { Field, Formik, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import AddParameters from '../../../types/AddParameters'
import useSongModal from '../useSongModal'
import { CenteredModalBox } from '../../StyledMUI'
import { PostgrestError } from '@supabase/supabase-js'
import { CoupletStyles, supabaseAPI, useSupabaseCoupletStyles } from '../../../supabase/supabaseAPI'
import useQrModal from './useQrModal'
import { MuiColorInput } from 'mui-color-input'

const CoupletStylesSchema = Yup.object().shape({
  lineHeight: Yup.number()
    .required('Необходимо заполнить')
    .typeError('Должно быть десятичным числом с точкой после целых')
    .lessThan(3.1, 'Не стоит делать межстрочный интервал >3')
    .moreThan(0.2, 'Не стоит делать межстрочный интервал <0.2'),
  backgroundColor: Yup.string()
    .required('Необходимо заполнить'),
  color: Yup.string()
    .required('Необходимо заполнить'),
})

type IOnCoupletStylesFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<CoupletStyles>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useSongModal>['handleModalClose']]
>

const errCodes = [
  ['23505', 'Ошибка 23505']
]

const onCoupletStylesFormSubmit: IOnCoupletStylesFormSubmit = async (
  values, 
  actions, 
  enqueueSnackbar,
  handleModalClose
) => {
  console.log(values)
  const handleError = (error: PostgrestError | null) => {
    if (!error) return
    const errorMessage = errCodes.find(errorCd => errorCd[0] === error.code)
    enqueueSnackbar(errorMessage ? errorMessage[1] : error.message, {
      variant: 'error',
      anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
    })
    actions.setSubmitting(false)
  }

  const { error } = await supabaseAPI.setCoupletStyles(values)
  handleError(error)

  actions.setSubmitting(false)
  handleModalClose()
}

const CoupletStylesModal = ({
  enqueueSnackbar,
  handleModalClose,
  handleModalOpen,
  curState,
  modalOpen,
  theme
}: ReturnType<typeof useQrModal> & {
  curState: ReturnType<typeof useSupabaseCoupletStyles>['coupletStyles']
}) => {
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
              Стили куплета
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
                  onCoupletStylesFormSubmit(
                    values, 
                    actions, 
                    enqueueSnackbar,
                    handleModalClose
                  )
                }
              }
              validationSchema={CoupletStylesSchema}
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
                    name="lineHeight"
                    label="Межстрочный интервал"
                    size='small'
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <FormatLineSpacing />
                        </InputAdornment>
                      ) 
                    }}
                  />
                  <MuiColorInput
                    size='small'
                    variant='filled'
                    label='Основной цвет'
                    name='color'
                    value={values.color ?? '#ffffffff'}
                    onChange={(_, colors) => {
                      setFieldValue('color', colors.hex8)
                    }}
                    error={!!errors.color}
                    helperText={errors.color}
                    format={'hex8'}
                  />
                  <MuiColorInput
                    size='small'
                    variant='filled'
                    label='Цвет фона'
                    name='backgroundColor'
                    value={values.backgroundColor ?? '#ffffffff'}
                    onChange={(_, colors) => {
                      setFieldValue('backgroundColor', colors.hex8)
                    }}
                    error={!!errors.backgroundColor}
                    helperText={errors.backgroundColor}
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

export default CoupletStylesModal