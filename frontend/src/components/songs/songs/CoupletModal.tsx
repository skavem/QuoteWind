import * as Yup from 'yup'
import { Bookmark, Notes } from '@mui/icons-material'
import { Button, ButtonGroup, InputAdornment } from '@mui/material'
import { Field, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import { supabase } from '../../../supabase'
import AddParameters from '../../../types/AddParameters'
import { PostgrestError } from '@supabase/supabase-js'
import useCoupletModal from '../useCoupletModal'
import { DBTables } from '../../../types/supabase-extended'
import ModalForm from '../../ModalForm/ModalForm'
import { supabaseAPI } from '../../../supabase/supabaseAPI'

export type CoupletFields = {
  label: DBTables['Couplet']['Row']['label']
  text: DBTables['Couplet']['Row']['text']
  index: DBTables['Couplet']['Row']['index']
  id: DBTables['Couplet']['Row']['id']
} | {
  label: DBTables['Couplet']['Row']['label']
  text: DBTables['Couplet']['Row']['text']
  index: DBTables['Couplet']['Row']['index']
  songId: DBTables['Song']['Row']['id']
}

const SongSchema = Yup.object().shape({
  label: Yup.string()
    .max(100, 'Сликшом длинная метка')
    .required('Необходимо заполнить'),
  text: Yup.string()
    .required('Необходимо заполнить'),
  index: Yup.number()
})

type IOnSongFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<CoupletFields>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useCoupletModal>['handleClose']]
>

const errCodes = [
  ['PGRST000', 'Нет соединения с сервером']
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

  if ('id' in values) {
    const { error } = await supabase.from('Couplet')
      .update({ label: values.label, text: values.text })
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
    try {
      await supabaseAPI.rearrangeCouplets(values.songId, values.index)
    } catch (e) {
      handleError(e as PostgrestError)
    }

    const { error } = await supabase
      .from('Couplet')
      .insert({
        label: values.label,
        text: values.text,
        song_id: values.songId,
        index: values.index
      })

    if (error) {
      handleError(error)
      return
    }
  }

  actions.setSubmitting(false)
  handleModalClose()
}

const CoupletModal = (props: ReturnType<typeof useCoupletModal>) => {
  return (
    <ModalForm
      {...props}
      curState={props.modalItem ?? { label: '', text: '', songId: 0, index: 0 }}
      modalName={'Куплет'}
      onFormSubmit={onSongFormSubmit}
      schema={SongSchema}
    >
      {({ setFieldValue }) => (
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
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <ButtonGroup size='small'>
                    <Button
                      onClick={(e) => setFieldValue('label', 'Куплет')}
                    >
                      Куплет
                    </Button>
                    <Button 
                      onClick={(e) => setFieldValue('label', 'Припев')}
                    >
                      Припев
                    </Button>
                  </ButtonGroup>
                </InputAdornment>
              ),
            }}
          />
          <Field
            component={TextField}
            multiline
            minRows={4}
            maxRows={10}
            name="text"
            label="Текст"
            size='small'
            variant="filled"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Notes />
                </InputAdornment>
              )
            }}
            sx={{position: 'relative'}}
          />
        </>
      )}
    </ModalForm>
  )
}

export default CoupletModal