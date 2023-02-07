import React, { PropsWithChildren } from 'react'
import { Box, styled } from '@mui/material'

import Navbar from '../components/Navbar/Navbar'
import { useSupabaseSession } from '../supabase'
import { Navigate, useLocation } from 'react-router-dom'

const PagePort = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  minHeight: '0',
  height: '100%'
}))

const ViewPort = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

const ProtectedPage: React.FC<PropsWithChildren> = ({ children }) => {
  const session = useSupabaseSession()
  const { pathname } = useLocation()

  if (!session && pathname !== '/login') {
    return (<Navigate to='login' state={{navigateTo: pathname}} />)
  }

  return (<>{children}</>)
}

const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ViewPort>
      <Navbar />
      <PagePort>
        <ProtectedPage>
          {children}
        </ProtectedPage>
      </PagePort>
    </ViewPort>
  )
}

export default PageLayout