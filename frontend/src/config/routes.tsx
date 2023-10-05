import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';
import { NoteEntry } from '../component/note/NoteEntry';

export const routes = {
  authRoutes: [
    { path: '/login', element: <Login/> },
    { path: '/register', element: <Register/> }
  ],

  privateRoutes: [
    { path: '/', element: <a></a> },
    { path: '/notes/new', element: <NoteEntry/> },
    { path: '/notes/:id/edit', element: <NoteEntry/> }
  ]
}
