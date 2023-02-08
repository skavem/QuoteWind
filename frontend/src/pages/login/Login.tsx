import { 
  Button,
  InputAdornment,
  styled,
  Typography,
  Stack,
  Divider
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import KeyIcon from '@mui/icons-material/Key'
import * as Yup from 'yup'
import { Form, Formik, Field, FormikConfig } from 'formik'
import { TextField } from 'formik-mui'
import { Navigate, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { AuthRetryableFetchError } from '@supabase/gotrue-js'

import { supabase, useSupabaseSession } from '../../supabase'
import AddParameters from '../../types/AddParameters'

const Centered = styled(Form)({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex'
})

const LoginForm = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
  borderRadius: '10px',
  width: '500px'
}))

const LoginTextField = styled(TextField)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.background.paper,
  borderRadius: '5px'
}))

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Не почта')
    .min(2, 'Слишком короткая почта!')
    .max(50, 'Слишком длинная почта!')
    .required('Необходимо заполнить'),
  password: Yup.string()
    .required('Необходимо заполнить'),
})

interface values {
  email: string,
  password: string
}

type IOnLoginFormSubmit = AddParameters<
  FormikConfig<values>['onSubmit'], 
  [ReturnType<typeof useSnackbar>['enqueueSnackbar']]
>

const onLoginFormSubmit: IOnLoginFormSubmit = async (
  values, 
  actions, 
  enqueueSnackbar
) => {
  try {
    const {
      error: authError 
    } = await supabase.auth.signInWithPassword(values)
    if (authError instanceof AuthRetryableFetchError) {
      enqueueSnackbar(
        'Нет соединения с сервером', 
        {
          variant: 'error', 
          anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
        }
      )
    } else if (authError) {
      actions.setErrors({ password: 'Аккаунт с такими данными не найден' })
    }
  } catch (error) {
    enqueueSnackbar(
      'Неизвестная ошибка при авторизации', 
      {
        variant: 'error', 
        anchorOrigin: {horizontal: 'center', vertical: 'bottom'}
      }
    )
  } finally {
    actions.setSubmitting(false)
  }
}

const Login = () => {
  const session = useSupabaseSession()
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  if (session) {
    return (
      <Navigate to={location.state ? location.state.navigateTo ?? '/' : '/'} />
    )
  }  

  return (
    <Formik 
      initialValues={{ email: '', password: '' }}
      onSubmit={
        (values, actions) => onLoginFormSubmit(values, actions, enqueueSnackbar)
      }
      validationSchema={SignupSchema}
    >
      {({ submitForm, errors }) => (
        <Centered>
          <LoginForm spacing={2}>
            <Typography 
              variant='h6' 
              sx={{textAlign: 'center'}}
            >
              QuoteWind
            </Typography>
            <Divider color='white'/>
            <Field
              component={LoginTextField}
              name="email"
              type="email"
              label="Email"
              size='small'
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PersonIcon />
                  </InputAdornment>
                ) 
              }}
            />
            <Field
              component={LoginTextField}
              name="password"
              type="password"
              label="Password"
              size='small'
              variant="filled"
              autoComplete='on'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <KeyIcon />
                  </InputAdornment>
                ) 
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={submitForm}
            >
              Войти
            </Button>
          </LoginForm>
        </Centered>
      )}
    </Formik>
  )
}

export default Login