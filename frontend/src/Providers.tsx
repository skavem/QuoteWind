import React, { PropsWithChildren } from 'react'
import store from './store'
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@mui/material'
import theme from './theme'

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={5}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </SnackbarProvider>
    </Provider>
  )
}

export default Providers