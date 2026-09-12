import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthProvider';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Movie from './pages/Movie';
import Profile from './pages/Profile';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />
            <Route
              path='/movies/:id'
              element={
                <ProtectedRoute>
                  <Movie />
                </ProtectedRoute>
              }
            />
            <Route
              path='/watchlist'
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path='/login' element={<Login />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>

      <ToastContainer
        autoClose={2400}
        closeOnClick
        pauseOnHover
        position='top-right'
        theme='light'
      />
    </>
  );
}

export default App;
