// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('ออกจากระบบสำเร็จ!');
      navigate('/'); // Redirect to Auth component
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ระบบบันทึกแจ้งเตือนงาน
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
