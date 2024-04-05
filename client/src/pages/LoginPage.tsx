import React, { useState, useEffect } from "react";
import httpClient from "../httpClient";

import { Typography, TextField, Button, Box, Container } from '@mui/material';

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const logInUser = async () => {
      console.log(email, password);

      try {
        const resp = await httpClient.post("http://localhost:5001/login", {
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
                    Log Into Your Account
                </Typography>
                <form>
                    <Box sx={{ marginBottom: 4, marginTop:5 }}>
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
                    <Button variant="contained" onClick={() => logInUser()}>
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
  );
};

export default LoginPage;