import React, { useState } from "react";
import axios from "axios";

const registerUrl = "https://g4xzwk108c.execute-api.ap-south-1.amazonaws.com/prod/register";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      setMessage("Invalid email address");
      return;
    }
    if (!validateUsername(username)) {
      setMessage("Username should start with letters and not contain special characters or spaces");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    // Sanitization
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    console.log("Email:", sanitizedEmail);
    console.log("Username:", sanitizedUsername);
    console.log("Password:", sanitizedPassword);
    // You can perform further actions like sending data to a server here

    const requestConfig = {
      headers: {
        "x-api-key": "q4Z9pvtG4V295PQEPoZ0P8CIghGkEZ5A5egAFymg",
      },
    };

    const requestBody = {
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: sanitizedPassword,
    };

    axios.post(registerUrl, requestBody, requestConfig).then((response) => {
      console.log("Response:", response.data);
      setMessage("Registration successful");
    }).catch((error) => {
      console.error("Error:", error);
      if (error.response.status === 401) {
        setMessage(error.response.data.message);
      }else{
        setMessage("An error occurred. Please try again later.")
      }
    });

  };

  const validateEmail = (email) => {
    // Basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUsername = (username) => {
    // Username should start with letters and not contain special characters or spaces
    const re = /^[a-zA-Z][a-zA-Z0-9]*$/;
    return re.test(String(username));
  };

  const sanitizeInput = (input) => {
    // Simple sanitization to prevent XSS attacks
    return input.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>Register</button>
      </form>
      {message && <p style={styles.errorMessage}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px 30px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '5px 0px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
};

export default Register;
