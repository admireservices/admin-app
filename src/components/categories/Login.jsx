import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginContainer = styled(Paper)({
  width: "400px",
  padding: "30px",
  margin: "80px auto",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
});

const InputField = styled(TextField)({
  marginBottom: "15px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: "#1976d2" },
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f7fc">
      <LoginContainer>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Admin Login
        </Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px">
          Enter your credentials to continue
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <InputField fullWidth label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField fullWidth label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ marginTop: "10px", padding: "10px", fontWeight: "bold" }}>
          Login
        </Button>
      </LoginContainer>
    </Box>
  );
}


{/*}
import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled(Paper)({
  width: "400px",
  padding: "30px",
  margin: "80px auto",
  textAlign: "center",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
});

const InputField = styled(TextField)({
  marginBottom: "15px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    // Replace with actual authentication logic
    if (email === "admin@example.com" && password === "admin123") {
      navigate("/home"); // Redirect to dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f4f7fc">
      <LoginContainer>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Login
        </Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px">
          Enter your credentials to continue
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <InputField
          fullWidth
          label="Email Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginTop: "10px", padding: "10px", fontWeight: "bold" }}
        >
          Login
        </Button>
      </LoginContainer>
    </Box>
  );
}
*/}