import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import {
  Box,
  TextField,
  Button,
  Link,
  Typography,
  Grid,
  Container,
} from "@mui/material";

const CreateAccount = () => {
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexContact = /^\d+$/;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isContactValid, setIsContactValid] = useState(true);
  const [emailErrorMessage, setEmailErrorMessage] = useState("Invalid email address");

 
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const body=JSON.stringify({
        firstName,
        lastName,
        dob,
        email,
        contact,
        password
      });
      console.log(body);
      //const response = await fetch("https://9remhkebwc.execute-api.us-east-1.amazonaws.com/prod/userDetails", {
        const response = await fetch(process.env.REACT_APP_API_URL+"/Dev/userDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      console.log("Create Account Response: ", response); 
      if (response.status === 201) {
        const response = await fetch(process.env.REACT_APP_API_URL+"/Dev/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email
        }),
      });
      localStorage.setItem("email", email);
        setFirstName('');
          setLastName('');
          setDob('');
          setEmail('');
          setContact('');
          setPassword('');

        navigate('/gallery');
      }
      else if(response.status === 400)
      {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error;
        setEmailErrorMessage(errorMessage);
        setIsEmailValid(false);
      }
      
    } catch (error) {
      console.error("Error: ", error);
    }

  };

  const handlePasswordChange = (event) => {
    setIsPasswordValid(true);
    const password = event.target.value;
    if (password !== "") {
      const isValid = regexPassword.test(password);
      setIsPasswordValid(isValid);
    }
  };

  const handleEmailChange = (event) => {
    setEmailErrorMessage("Invalid email address");
    setIsEmailValid(true);
    const email = event.target.value;
    if (email !== "") {
      const isValid = regexEmail.test(email);
      setIsEmailValid(isValid);
    }
  };

  const handleContactChange = (event) => {
    setIsContactValid(true);
    setContact(event.target.value);
    if (contact !== "") {
      const isValid = regexContact.test(contact);
      setIsContactValid(isValid);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        
        
        my: 4,
        width: "70%",
      }}
      onSubmit={handleSubmit}
      className="author-card"
    >
      <Container >
      <Grid container spacing={3} direction="row-reverse">
        
      
      <Grid item xs={6}>
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>
      <TextField
        label="First Name"
        type="text"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        error={false} 
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label="Last Name"
        type="text"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        error={false}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label="Date of Birth"
        type="date"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        error={false}
        onChange={(e) => setDob(e.target.value)}
      />
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        error={!isEmailValid}
        helperText={!isEmailValid ? emailErrorMessage : ""}
        onBlur={handleEmailChange}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Contact"
        type="text"
        required
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{
          pattern: "[0-9]*",
          maxLength: 10,
        }}
        error={!isContactValid}
        helperText={!isContactValid ? "Contact must contain only numbers" : ""}
        onChange={handleContactChange}
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
            ? "At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character."
            : ""
        }
        onBlur={handlePasswordChange}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ width: "50%", margin: "20px auto" }}>
        Create Account
      </Button>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Already have an account? <Link href="/" underline="hover">Login</Link>
        </Typography>
      </Box>
      </Grid></Grid></Container>
    </Box>
  );
};

export default CreateAccount;
