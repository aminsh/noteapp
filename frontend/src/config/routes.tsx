import { Login } from '../component/user/Login';
import { Register } from '../component/user/Register';

export const routes = {
  authRoutes: [
    { path: '/login', element: <Login/> },
    { path: '/register', element: <Register/> }
  ],

  privateRoutes: [
    { path: '/', element: <a></a> }
  ]
}
