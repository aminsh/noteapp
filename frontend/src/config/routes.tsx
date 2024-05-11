import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';
import { NoteEntry } from '../component/note/NoteEntry';
import { Notes } from '../component/note/Notes'
import { Files } from '../component/File/Files'

export const routes = {
  authRoutes: [
    {path: '/login', element: <Login/>},
    {path: '/register', element: <Register/>},
  ],

  privateRoutes: [
    {path: '/', element: <></>},
    {path: '/notes/me', element: <Notes type="MyNotes"/>},
    {path: '/notes/shared-with-me', element: <Notes type="SharedNotes"/>},
    {path: '/notes/new', element: <NoteEntry/>},
    {path: '/notes/:id/edit', element: <NoteEntry/>},
    {path: '/files', element: <Files/>}
  ],
}
