import React, { useState } from "react";
import image from '../Images/loginimg.png';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Link,
} from "@mui/material";

const LoginForm = () => {
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let loginResponse;
      loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/Dev/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (loginResponse.status === 200) {
        const responseBody = loginResponse.data;
        //const data = JSON.parse(responseBody.body);
        localStorage.setItem("email", responseBody.email);
        const emailResponse = await fetch(process.env.REACT_APP_API_URL+"/Dev/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email
          }),
        });
        window.location.href = "/gallery";
      } else {
        setPasswordErrorMsg("Invalid email or password");
        setIsPasswordValid(false);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    try {
      if (!isEmailValid || email === "") {
        setIsEmailValid(false);
      } else {
        const response = await fetch("https://nomadic-pen.onrender.com/user/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        });
        
        const code = await response.text();
        console.log(code);
        console.log(email);
        navigate('/reset', { state: { code, email } });
      }
    } catch (error) {
      setPasswordErrorMsg("Unable to change password");
      setIsPasswordValid(false);
      console.error("Error: ", error);
    }
  };

  const handlePasswordChange = (event) => {
    setIsPasswordValid(true);
    const enteredPassword = event.target.value;
    setPassword(enteredPassword);

    if (enteredPassword !== "") {
      const isValid = regexPassword.test(enteredPassword);
      setPasswordErrorMsg("Minimum 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.");
      setIsPasswordValid(isValid);
    }
  };

  const handleEmailChange = (event) => {
    setIsEmailValid(true);
    const enteredEmail = event.target.value;
    setEmail(enteredEmail);

    if (enteredEmail !== "") {
      const isValid = regexEmail.test(enteredEmail);
      setIsEmailValid(isValid);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "400px",
        mx: "auto",
        marginTop: "60px"
      }}
      onSubmit={handleSubmit}
      className="author-card"
    >
      <img src={image} alt='loginImage' width="150" height="150" />
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        error={!isEmailValid}
        helperText={
          !isEmailValid ? "Enter a valid Email address" : ""
        }
        onBlur={handleEmailChange}
        onChange={handleEmailChange}
        value={email}
      />
      <TextField
        label="Password"
        type="password"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        error={!isPasswordValid}
        helperText={
          !isPasswordValid
            ? passwordErrorMsg
            : ""
        }
        onBlur={handlePasswordChange}
        onChange={handlePasswordChange}
        value={password}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ width: "20%", margin: "12px auto" }}>
        Login
      </Button>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", width: "100%", margin: "-8px 0" }}>
        <Link href="/signup" variant="body2">
          Create an account
        </Link>
        <Link href="#" onClick={handleForgotPassword} underline="hover">Forgot Password?</Link>
      </Box>
    </Box>
  );
};

export default LoginForm;
