import Verses from "./verses/Verses"
import Songs from "./songs/Songs"
import { Navigate } from "react-router-dom"

const pageList = [
  { path: '/', element: <Navigate to={'verses'}/>, name: null},
  { path: 'verses', element: <Verses />, name: 'Библия' },
  { path: 'songs', element: <Songs />, name: 'Песни' }
]

export type pageListType = typeof pageList

export default pageList