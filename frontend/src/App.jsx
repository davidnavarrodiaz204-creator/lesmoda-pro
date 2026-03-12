// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<StorePage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin"       element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="*"            element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
