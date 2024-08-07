import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "@services/auth.service";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function SignupPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data", data);
    authService
      .signup(data)
      .then((createdUser) => {
        console.log(createdUser), navigate("/login");
      })
      .catch((err) => {
        console.error("Error while creating a user", err);
        const errorDescription = err.response.data.message
          ? err.response.data.message
          : err.request.statusText;
        setErrorMessage("❌ " + errorDescription);
      });
  };

  const handleOnChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <main className="login-container">
      <div className="side-pic-signup"></div>
      <Box
        ml="8%"
        mt="10%"
        sx={{
          width: {
            sx: "90%",
            sm: "30%",
            md: "27%",
            lg: "27%",
            xl: "20%",
          },
        }}
      >
        <Typography variant="h5" component="h1" mb="20px">
          Signup to Todo
        </Typography>
        <Box component="form" display="flex" flexDirection="column">
          <TextField
            id="name"
            label="Name"
            type="text"
            variant="outlined"
            value={data.name}
            onChange={handleOnChange}
            required
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            value={data.email}
            onChange={handleOnChange}
            required
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            value={data.password}
            onChange={handleOnChange}
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            color="black"
          >
            Sign up
          </Button>
        </Box>
        <Typography variant="body2" mt="20px" align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </main>
  );
}

export default SignupPage;
