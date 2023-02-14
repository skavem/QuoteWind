import * as Yup from 'yup'
import { Abc, Percent } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { Field, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import AddParameters from '../../../types/AddParameters'
import useSongModal from '../useSongModal'
import { PostgrestError } from '@supabase/supabase-js'
import { supabaseAPI, useSupabaseQr } from '../../../supabase/supabaseAPI'
import { MuiColorInput } from 'mui-color-input'
import useModalForm from '../../ModalForm/useModalForm'
import ModalForm from '../../ModalForm/ModalForm'

type QrStyles = Omit<ReturnType<typeof useSupabaseQr>['qrStyles'], 'shown'>

const QRSchema = Yup.object().shape({
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

type OnQrFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<QrStyles>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useModalForm>['handleClose']]
>

const errCodes = [
  ['23505', 'Ошибка 23505']
]
  

const onQrFormSubmit: OnQrFormSubmit = async (
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

const QrModal = (props: ReturnType<typeof useModalForm> & {
  curState: QrStyles
}) => {
  return (
    <ModalForm
      {...props}
      curState={props.curState}
      modalName='Стиль QR'
      onFormSubmit={onQrFormSubmit}
      schema={QRSchema}
    >
      {({ values, errors, setFieldValue }) => (
        <>
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
        </>
      )}
    </ModalForm>
  )
}

export default QrModal