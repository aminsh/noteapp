import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';
import { NoteList } from '../component/note/NoteList'
import { Files } from '../component/File/Files'
import { NotePublicPreview } from '../component/note/NotePublicPreview'
import React from 'react'

export type RouteConfiguration = {
  path: string
  element: React.ReactNode
  children?: RouteConfiguration[]
}

export const routes: Record<string, RouteConfiguration[]> = {
  authRoutes: [
    {path: '/login', element: <Login/>},
    {path: '/register', element: <Register/>},
  ],

  privateRoutes: [
    {path: '/', element: <></>},
    {
      path: '/notes',
      element: <NoteList/>,
    },
    {path: '/files', element: <Files/>},
  ],

  publicRoutes: [
    {path: '/content/:id', element: <NotePublicPreview/>},
  ],
}
