import { Login } from '../component/user/Login';

export const routes = {
  authRoutes: [
    { path: '/login', element: <Login/> },
    { path: '/signup', element: <a></a> }
  ],

  privateRoutes: [
    { path: '/', element: <a></a> }
  ]
}
