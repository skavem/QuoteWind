import * as Yup from 'yup'
import { Cancel, Close, Save } from '@mui/icons-material'
import { Box, Button, IconButton, Modal, Paper, Typography } from '@mui/material'
import { Formik, FormikConfig, FormikProps } from 'formik'
import { useSnackbar } from 'notistack'
import AddParameters from '../../types/AddParameters'
import useModalForm from './useModalForm'
import { CenteredModalBox } from '../StyledMUI'

export type ModalFormObject = {
  [key: string]: any
}

export type OnFormSubmit<T extends ModalFormObject> = AddParameters<
  AddParameters<
    FormikConfig<T>['onSubmit'], 
    [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
  >,
  [ReturnType<typeof useModalForm>['handleClose']]
>

const ModalForm = <T extends ModalFormObject,>({
  enqueueSnackbar, handleClose,
  curState, isOpen, theme, schema, children, onFormSubmit,
  modalName
}: Omit<ReturnType<typeof useModalForm>, 'handleOpen'> & {
  curState: T,
  schema: Yup.BaseSchema,
  children: (props: FormikProps<T>) => React.ReactNode,
  onFormSubmit: OnFormSubmit<T>,
  modalName: string
}) => {
  return (
    <Modal open={isOpen} onClose={handleClose} >
      <CenteredModalBox>
        <Paper elevation={1} sx={{minWidth: '600px'}} >
          <Box 
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              boxShadow: '0px 1px 2px' + theme.palette.primary.main,
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              padding: theme.spacing(1, 2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant='h6' component='h2' textAlign={'center'}>
              {modalName}
            </Typography>
            <IconButton 
              sx={{ color: theme.palette.primary.contrastText }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Box>
          <Box padding={2}>
            <Formik
              initialValues={curState}
              onSubmit={
                (values, actions) => {
                  onFormSubmit(
                    values, 
                    actions, 
                    enqueueSnackbar,
                    handleClose
                  )
                }
              }
              validationSchema={schema}
            >
              {(formikProps) => (
                <Box 
                  display={'flex'}
                  flexDirection={'column'} 
                  gap={1}
                  onKeyUp={(e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                      formikProps.submitForm()
                      e.stopPropagation()
                    }
                  }}
                >
                  {children(formikProps)}
                  <Box display={'flex'} gap={1} justifyContent={'flex-end'} marginTop={2}>
                    <Button
                      title='Сохранить (ctrl + enter)'
                      variant="contained"
                      color="secondary"
                      onClick={formikProps.submitForm}
                      startIcon={<Save />}
                    >
                      Сохранить
                    </Button>
                    <Button
                      title='Отменить (esc)'
                      variant='outlined'
                      onClick={handleClose}
                      startIcon={<Cancel />}
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

export default ModalForm