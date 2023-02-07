import React from 'react'
import * as Yup from 'yup'
import { Badge, Bookmark, Close } from '@mui/icons-material'
import { Box, Button, IconButton, InputAdornment, Modal, Paper, Typography } from '@mui/material'
import { Field, Formik, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { useSnackbar } from 'notistack'
import { supabase } from '../../../supabase'
import AddParameters from '../../../types/AddParameters'
import { DBTables } from '../../../types/supabase'
import useSongModal from '../useSongModal'
import { CenteredModalBox } from '../../StyledMUI'
import { PostgrestError } from '@supabase/supabase-js'

export interface SongFields {
  label: DBTables['Song']['Row']['label'],
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
})

type IOnSongFormSubmit = AddParameters<
  AddParameters<
    FormikConfig<SongFields>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useSongModal>['handleModalClose']]
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
      .update({ label: values.label, name: values.name})
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
      .insert({ label: values.label, name: values.name })

    if (error) {
      handleError(error)
      return
    }
  }

  actions.setSubmitting(false)
  handleModalClose()
}

const SongModal = ({
  enqueueSnackbar,
  handleModalClose,
  handleModalOpen,
  modalItem,
  modalOpen,
  theme
}: ReturnType<typeof useSongModal>) => {
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
              initialValues={modalItem ?? { label: '', name: '' }}
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
                  <Box display={'flex'} gap={1} justifyContent={'flex-end'} marginTop={2}>
                    <Button
                      title='Сохранить песню (ctrl + enter)'
                      variant="contained"
                      color="secondary"
                      onClick={submitForm}
                    >
                      Сохранить
                    </Button>
                    <Button
                      title='Отменить изменения (esc)'
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

export default SongModal