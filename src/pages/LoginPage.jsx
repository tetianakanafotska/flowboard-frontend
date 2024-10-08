import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "@context/authContext.jsx";
import authService from "@services/auth.service.js";
import {
  Button,
  Alert,
  Typography,
  Box,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { signup } from "@/assets";
import { logoWhite } from "@/assets";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(null);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const requestBody = { email, password };
    authService
      .login(requestBody)
      .then((response) => {
        storeToken(response.data.authToken);
        return authenticateUser();
      })
      .then(() => {
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        const errorDescription = error.response
          ? error.response.data.message
          : error.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <Stack direction="row" sx={{ overflow: "hidden" }}>
      <Box
        className="login-sidepic"
        sx={{
          display: {
            xs: "none",
            lg: "block",
          },
        }}
      >
        <Box className="text-container" onClick={() => navigate("/")}>
          <img src={logoWhite} alt="Logo" width="170px" loading="lazy" />
          <Typography sx={{ color: "#fff", fontWeight: "200" }}>
            Your personal productivity space
          </Typography>
        </Box>

        <img
          src={signup}
          alt=""
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          loading="lazy"
        />
      </Box>
      <Box
        sx={{
          m: {
            xs: "10% auto",
            lg: "10% 0 10% 8%",
          },
          width: {
            sx: "97%",
            sm: "40%",
            md: "33%",
            lg: "27%",
            xl: "20%",
          },
        }}
      >
        <Typography variant="h5" component="h1" mb="20px">
          Login to Todo
        </Typography>
        <Box component="form" display="flex" flexDirection="column">
          <TextField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmail}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePassword}
          />
          {errorMessage && (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMessage(null);
              }}
              sx={{ mb: "20px" }}
            >
              {errorMessage}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="black"
            onClick={handleLoginSubmit}
            sx={{ padding: "11px 16px" }}
          >
            {loading ? <CircularProgress size={25} /> : "Login"}
          </Button>
        </Box>

        <Typography variant="body2" mt="20px" align="center">
          Don't have an account?{" "}
          <Link to="/signup" className="login-link">
            Sign up for free
          </Link>
        </Typography>
      </Box>
    </Stack>
  );
}

export default LoginPage;
