import * as Yup from 'yup'
import { FormatLineSpacing, SettingsBackupRestore } from '@mui/icons-material'
import { Button, InputAdornment } from '@mui/material'
import { Field } from 'formik'
import { TextField } from 'formik-mui'
import { PostgrestError } from '@supabase/supabase-js'
import { supabaseAPI } from '../../../supabase/supabaseAPI'
import { MuiColorInput } from 'mui-color-input'
import useModalForm from '../../ModalForm/useModalForm'
import ModalForm, { OnFormSubmit } from '../../ModalForm/ModalForm'
import { defaultStyles, VerseStyles } from '../../../store/shown/shownReducer'

const VerseStylesSchema = Yup.object().shape({
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

const errCodes = [
  ['23505', 'Ошибка 23505']
]


const onVerseStylesFormSubmit: OnFormSubmit<
  VerseStyles
> = async (
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

  const { error } = await supabaseAPI.setVerseStyles(values)
  handleError(error)

  actions.setSubmitting(false)
  handleModalClose()
}

const VerseStylesModal = (props: ReturnType<typeof useModalForm> & {
  curState: VerseStyles
}) => {
  return (
    <ModalForm
      {...props}
      schema={VerseStylesSchema}
      modalName={'Стиль стиха'}
      onFormSubmit={onVerseStylesFormSubmit}
    >
      {({ values, setFieldValue, errors }) => (
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
              ),
              endAdornment: (
                +values.lineHeight !== defaultStyles.verse.lineHeight 
                ? <Button
                    onClick={() => setFieldValue(
                      'lineHeight',
                      defaultStyles.verse.lineHeight
                    )}
                  >
                    <SettingsBackupRestore />
                  </Button>
                : <></>
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
            InputProps={{
              endAdornment: (
                values.color !== defaultStyles.verse.color 
                ? <Button
                    onClick={() => setFieldValue(
                      'color',
                      defaultStyles.verse.color
                    )}
                  >
                    <SettingsBackupRestore />
                  </Button>
                : <></>
              )
            }}
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
            InputProps={{
              endAdornment: (
                values.backgroundColor !== defaultStyles.verse.backgroundColor 
                ? <Button
                    onClick={() => setFieldValue(
                      'backgroundColor',
                      defaultStyles.verse.backgroundColor
                    )}
                  >
                    <SettingsBackupRestore />
                  </Button>
                : <></>
              )
            }}
          />
        </>
      )}
    </ModalForm>
  )
}

export default VerseStylesModal