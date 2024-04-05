import React, { useState } from "react";
import httpClient from "../httpClient";

import { Box, Container, Typography, Button, TextField } from '@mui/material';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const registerUser = async () => {
    try {
      const resp = await httpClient.post("//localhost:5001/register", {
        username,
        email,
        password,
      });

      window.location.href = "/";
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Create an account
        </Typography>
        <form>
          <Box sx={{ marginTop: 4, marginBottom: 4 }}>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: 4 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ marginBottom: 4 }}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <Button variant="contained" onClick={() => registerUser()}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterPage;