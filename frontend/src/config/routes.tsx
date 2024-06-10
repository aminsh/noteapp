import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';
import { NoteEntry } from '../component/note/NoteEntry';
import { NoteList } from '../component/note/NoteList'
import { Files } from '../component/File/Files'
import { NotePublicPreview } from '../component/note/NotePublicPreview'

export const routes = {
  authRoutes: [
    {path: '/login', element: <Login/>},
    {path: '/register', element: <Register/>},
  ],

  privateRoutes: [
    {path: '/', element: <></>},
    {path: '/notes', element: <NoteList/>},
    {path: '/notes/new', element: <NoteEntry/>},
    {path: '/notes/:id/edit', element: <NoteEntry/>},
    {path: '/files', element: <Files/>}
  ],

  publicRoutes: [
    {path: '/content/:id', element: <NotePublicPreview/>},
  ]
}
