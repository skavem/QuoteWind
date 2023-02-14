import * as Yup from 'yup'
import { Badge, Bookmark } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'
import { Field, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import { supabase } from '../../../supabase'
import AddParameters from '../../../types/AddParameters'
import useSongModal from '../useSongModal'
import { PostgrestError } from '@supabase/supabase-js'
import { DBTables } from '../../../types/supabase-extended'
import ModalForm from '../../ModalForm/ModalForm'

export interface SongFields {
  label: number | null,
  name: DBTables['Song']['Row']['name'],
  id?: DBTables['Song']['Row']['id']
}

const SongSchema = Yup.object().shape({
  label: Yup.number()
    .typeError('Метка должна положительным целым числом')
    .positive('Метка должна положительным целым числом')
    .integer('Метка должна положительным целым числом')
    .max(10 ** 10, 'Метка не должна быть больше 10_000_000_000')
    .required('Необходимо заполнить'),
  name: Yup.string()
    .required('Необходимо заполнить'),
  id: Yup.number()
})

type IOnSongFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<SongFields>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useSongModal>['handleClose']]
>

const errCodes = [
  ['23505', 'Песня с такой меткой уже существует']
]

const onSongFormSubmit: IOnSongFormSubmit = async (
  values, 
  actions, 
  enqueueSnackbar,
  handleModalClose
) => {
  const handleError = (error: PostgrestError) => {
    const errorMessage = errCodes.find(errorCd => errorCd[0] === error.code)
    enqueueSnackbar(errorMessage ? errorMessage[1] : error.message, {
      variant: 'error',
      anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
    })
    actions.setSubmitting(false)
  }

  if (values.id) {
    const { error } = await supabase.from('Song')
      .update({ label: values.label!.toString(), name: values.name})
      .eq('id', values.id)
      .select()

    if (error) {
      handleError(error)
      return
    } else {
      enqueueSnackbar('Успешно сохранено', {
        variant: 'success',
        anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
      })
    }
  } else {
    const { error } = await supabase
      .from('Song')
      .insert({ label: values.label!.toString(), name: values.name })

    if (error) {
      handleError(error)
      return
    }
}

  actions.setSubmitting(false)
  handleModalClose()
}

const SongModal = (props: ReturnType<typeof useSongModal>) => {
  return (
    <ModalForm
      {...props}
      modalName={'Изменить/добавить песню'}
      curState={props.modalItem ?? { label: 0, name: '' }}
      onFormSubmit={onSongFormSubmit}
      schema={SongSchema}
    >
      {(props) => (
        <>
        <Field
            component={TextField}
            name="label"
            label="Метка"
            size='small'
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Bookmark />
                </InputAdornment>
              ) 
            }}
            />
          <Field
            component={TextField}
            name="name"
            label="Имя"
            size='small'
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Badge />
                </InputAdornment>
              ) 
            }}
          />
        </>
      )}
    </ModalForm>
  )
}

export default SongModal