import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes } from '../config/routes';
import { AuthLayout } from './layout/AuthLayout';
import { ProtectedLayout } from './layout/ProtectedLayout';

export function AppRoutes() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route element={ <AuthLayout/> }>
              { routes.authRoutes.map((route, index) =>
                <Route key={ `auth-${ index }` } path={ route.path } element={ route.element }/>
              ) }
            </Route>

            <Route element={ <ProtectedLayout/> }>
              { routes.privateRoutes.map((route, index) =>
                <Route key={ `private-${ index }` } path={ route.path } element={ route.element }/>
              ) }
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}
