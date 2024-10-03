// src/App.js
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CircularProgress, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load components
const Auth = lazy(() => import('./components/Auth'));
const TaskList = lazy(() => import('./components/TaskList'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show a loading spinner while checking auth state
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: 'url(/bg.png)', // ชี้ไปยังไฟล์ภาพที่อยู่ในโฟลเดอร์ public
          backgroundSize: 'cover',          // ปรับขนาดภาพให้ครอบคลุมทั้งหมด
          backgroundRepeat: 'no-repeat',    // ไม่ให้ภาพซ้ำ
          backgroundPosition: 'center',     // จัดตำแหน่งภาพให้อยู่กึ่งกลาง
          minHeight: '100vh',               // ให้พื้นหลังครอบคลุมความสูงของ viewport
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* Redirect root path based on authentication */}
              <Route path="/" element={user ? <Navigate to="/tasks" replace /> : <Auth />} />
              {/* Protected TaskList route */}
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute user={user}>
                    <TaskList />
                  </ProtectedRoute>
                }
              />
              {/* Catch-all route to redirect to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
        <ToastContainer position="bottom-right" /> {/* ตำแหน่งของ Toast */}
      </Box>
    </ThemeProvider>
  );
};

export default App;
