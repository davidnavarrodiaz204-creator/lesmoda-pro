import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './components/CartContext';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';

const AdminPage    = lazy(() => import('./pages/AdminPage'));
const ProductPage  = lazy(() => import('./pages/ProductPage'));
const AboutPage    = lazy(() => import('./pages/AboutPage'));
const HowToBuyPage = lazy(() => import('./pages/HowToBuyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A1612',
                color: '#FAF7F2',
                borderRadius: 10,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
              },
              success: { iconTheme: { primary: '#C9A96E', secondary: '#FAF7F2' } },
            }}
          />
          <Suspense fallback={<div style={{ display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', color:'#8A7968' }}>Cargando...</div>}>
            <Routes>
              <Route path="/"            element={<StorePage />} />
              <Route path="/about"       element={<AboutPage />} />
              <Route path="/how-to-buy"  element={<HowToBuyPage />} />
              <Route path="/producto/:slug" element={<ProductPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin"       element={<PrivateRoute><AdminPage /></PrivateRoute>} />
              <Route path="*"            element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
