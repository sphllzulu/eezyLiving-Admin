// src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';

//  admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Animation for the login box
const slideIn = keyframes`
  0% { transform: translateY(-50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

// Styled Paper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  color: '#fff', 
  borderRadius: '15px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  animation: `${slideIn} 0.8s ease-out`,
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    // Validate admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/admin'); // Redirect to the admin panel
      } catch (err) {
        setError('Failed to log in.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Incorrect admin credentials');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width:'100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c1c1e', 
      }}
    >
      <StyledPaper elevation={10}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: {
              color: 'white', 
              borderColor: '#7c4dff', 
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#7c4dff' }, 
              '&:hover fieldset': { borderColor: '#bb86fc' }, 
              '&.Mui-focused fieldset': { borderColor: '#bb86fc' },
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: {
              color: 'white',
              borderColor: '#7c4dff',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#7c4dff' },
              '&:hover fieldset': { borderColor: '#bb86fc' },
              '&.Mui-focused fieldset': { borderColor: '#bb86fc' },
            },
          }}
        />
        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Box display="flex" justifyContent="center" mt={2}>
          {loading ? (
            <CircularProgress sx={{ color: '#bb86fc' }} />
          ) : (
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                backgroundColor: 'purple', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'purple',
                },
                transition: 'background-color 0.3s ease',
              }}
            >
              Log In
            </Button>
          )}
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default Login;
