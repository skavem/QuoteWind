import React from 'react'
import { styled } from '@mui/system'
import { useLocation, useNavigate } from 'react-router-dom'
import { pageListType } from '../../pages'

interface pageTabsProps {
  pages: pageListType
}

const Page = styled('div')(({ theme }) => ({
  color: 'inherit',
  letterSpacing: '.25em',
  paddingLeft: '0.25em',
  cursor: 'pointer',

  margin: theme.spacing(0, 1),
  
  borderRadius: '0',
  borderBottom: '2px dotted rgb(0,0,0,0)',
  transition: 'border-color .25s ease-out',
  '&:hover': {
    borderBottom: '2px dotted'
  }
}))

const PageTab = ({page}: {page: pageListType[0]}) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <Page
      key={page.path} 
      onClick={() => navigate(page.path)}
      sx={
        '/' + page.path === pathname ? 
        { borderBottom: '2px solid' } : 
        null
      }
    >
      {page.name}
    </Page>
  )
}

const PageTabs = ({pages}: pageTabsProps) => {
  return (
    <>
      {pages.map(page => {
        if (page.name === null) return null
        return (<PageTab page={page} key={page.path}/>)
      })}
    </>
  )
}

export default PageTabs