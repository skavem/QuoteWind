import * as Yup from 'yup'
import { FormatLineSpacing } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { Field, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import AddParameters from '../../../types/AddParameters'
import { PostgrestError } from '@supabase/supabase-js'
import { supabaseAPI } from '../../../supabase/supabaseAPI'
import { MuiColorInput } from 'mui-color-input'
import ModalForm from '../../ModalForm/ModalForm'
import useModalForm from '../../ModalForm/useModalForm'
import { CoupletStyles } from '../../../store/shown/shownReducer'

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
  [ReturnType<typeof useModalForm>['handleClose']]
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

const CoupletStylesModal = (props: ReturnType<typeof useModalForm> & {
  curState: CoupletStyles
}) => {
  return (
    <ModalForm 
      {...props}
      modalName={'Стиль куплетов'}
      schema={CoupletStylesSchema}
      onFormSubmit={onCoupletStylesFormSubmit}
    >
      {({ values, errors, setFieldValue }) => (
        <>
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
        </>
      )}
    </ModalForm>
  )
}

export default CoupletStylesModal