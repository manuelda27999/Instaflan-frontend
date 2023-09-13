import Register from "./view/pages/Register";
import Login from "./view/pages/Login";
import Home from "./view/pages/Home";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import context from "./context";

export function App() {
  const navigate = useNavigate()
  context.navigate = navigate

  return (
    <Routes>
      <Route key={'login'} path="/login" element={context.token ? <Navigate to='/' /> : <Login />} />
      <Route key={'register'} path="/register" element={<Register />} />
      <Route key={'home'} path="/*" element={
        context.token ? <Home /> : <Navigate to='/login' />} />
    </Routes>)
}
