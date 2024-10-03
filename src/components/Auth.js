// src/components/Auth.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('สมัครสมาชิกสำเร็จ!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('เข้าสู่ระบบสำเร็จ!');
      }
      // หลังจากเข้าสู่ระบบสำเร็จ, คุณสามารถเปลี่ยนสถานะหรือทำการนำทางไปยังหน้าหลัก
    } catch (error) {
      console.error("Authentication Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={10} sm={8} md={4}>
        <Paper
          elevation={6}
          sx={{
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // ลดความโปร่งใสเพื่อให้พื้นหลังสามารถมองเห็นได้บางส่วน
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // เพิ่มเงาให้กับ Paper
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </Typography>
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <TextField
              label="อีเมล"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="รหัสผ่าน"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAuth} fullWidth>
              {isRegister ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            </Button>
            <Divider />
            <Button color="secondary" onClick={() => setIsRegister(!isRegister)} fullWidth>
              {isRegister ? "มีบัญชีแล้ว? เข้าสู่ระบบ" : "ยังไม่มีบัญชี? สมัครสมาชิก"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Auth;
