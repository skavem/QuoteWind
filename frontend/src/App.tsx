import React from 'react'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import pageList from './pages'
import PageLayout from './pages/PageLayout'
import Login from './pages/login/Login'
import { useSupabaseReduxSubscription } from './supabase/supabaseAPI'

function App() {
  useSupabaseReduxSubscription()

  return (
    <>
      <CssBaseline />
    
      <Router>
        <PageLayout>
          <Routes>
            <Route path='login' element={<Login />}/>
            {pageList.map(page => (
              <Route {...page} key={page.path}/>
              ))}
          </Routes>
        </PageLayout>
      </Router>
    </>
  )
}

export default App;
