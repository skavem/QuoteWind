import React from 'react'
import * as Yup from 'yup'
import { Bookmark, Close, Notes } from '@mui/icons-material'
import { Box, Button, IconButton, InputAdornment, Modal, Paper, Typography } from '@mui/material'
import { Field, Formik, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import { supabase } from '../../../supabase'
import AddParameters from '../../../types/AddParameters'
import useSongModal from '../useSongModal'
import { CenteredModalBox } from '../../StyledMUI'
import { PostgrestError } from '@supabase/supabase-js'
import useCoupletModal from '../useCoupletModal'
import { DBTables } from '../../../types/supabase-extended'

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
})

type IOnSongFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<CoupletFields>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useSongModal>['handleModalClose']]
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
      .update({ label: values.label, text: values.text, index: values.index })
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
    let { data: coupletsToChangeIndexes, error } = await supabase
      .from('Couplet')
      .select('id, index')
      .eq('song_id', values.songId)

    if (error) {
      handleError(error)
      return
    }

    coupletsToChangeIndexes = coupletsToChangeIndexes!.map((couplet, index) => ({
      ...couplet,
      index: index + 1 < values.index ? index + 1 : index + 2
    })).reverse();

    for await (const couplet of coupletsToChangeIndexes) {
      const { error } = await supabase
        .from('Couplet')
        .update({ index: couplet.index})
        .eq('id', couplet.id)

      if (error) {
        handleError(error)
        return
      }
    }

    ({ error } = await supabase
      .from('Couplet')
      .insert({
        label: values.label,
        text: values.text,
        song_id: values.songId,
        index: values.index
      }))

    if (error) {
      handleError(error)
      return
    }
  }

  actions.setSubmitting(false)
  handleModalClose()
}

const CoupletModal = ({
  enqueueSnackbar,
  handleModalClose,
  handleModalOpen,
  modalItem,
  modalOpen,
  theme
}: ReturnType<typeof useCoupletModal>) => {
  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
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
              Изменить песню
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
              initialValues={modalItem ?? { label: '', text: '', songId: 0, index: 0 }}
              onSubmit={
                (values, actions) => onSongFormSubmit(
                  values, 
                  actions, 
                  enqueueSnackbar,
                  handleModalClose
                )
              }
              validationSchema={SongSchema}
            >
              {({ submitForm }) => (
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
                  />
                  <Box display={'flex'} gap={1} justifyContent={'flex-end'} marginTop={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={submitForm}
                    >
                      Сохранить
                    </Button>
                    <Button
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

export default CoupletModal