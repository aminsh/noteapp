import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';
import { EditNote } from '../component/note/EditNote';

export const routes = {
  authRoutes: [
    { path: '/login', element: <Login/> },
    { path: '/register', element: <Register/> }
  ],

  privateRoutes: [
    { path: '/', element: <a></a> },
    { path: '/notes/new', element: <EditNote/> },
    { path: '/notes/:id/edit', element: <EditNote/> }
  ]
}
