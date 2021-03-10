import { Button, Dialog, TextField } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import React, { useState } from "react";
import { crypt } from "../crypt";

const Login = ({ open, onLogin }) => {
  const [loginData, setLoginData] = useState({});
  const [error, setError] = useState(false);

  const handleLoginButtonClick = async () => {
    try {
      const dataToSend = {
        username: loginData.username,
        password: crypt(loginData.username, loginData.password),
      };
      const res = await axios.post("/api/login", JSON.stringify(dataToSend), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onLogin(res.data.token, loginData.password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterButtonClick = async () => {
    try {
      const dataToSend = {
        username: loginData.username,
        password: crypt(loginData.username, loginData.password),
      };
      const res = await axios.post("/api/users", JSON.stringify(dataToSend), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onLogin(res.data.token, dataToSend.password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsernameChange = (event) => {
    setLoginData({
      ...loginData,
      username: event.target.value,
    });
  };
  const handlePasswordChange = (event) => {
    setLoginData({
      ...loginData,
      password: event.target.value,
    });
  };

  const handlePasswordKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLoginButtonClick();
    }
  };

  return (
    <Dialog open={open}>
      <MuiDialogTitle>Login</MuiDialogTitle>
      <MuiDialogContent>
        <TextField
          error={error}
          label="Username"
          onChange={handleUsernameChange}
          autoFocus
          fullWidth
          helperText={error && "Incorrect Login/password"}
        ></TextField>
        <TextField
          error={error}
          label="Password"
          type="password"
          onChange={handlePasswordChange}
          onKeyPress={handlePasswordKeyPress}
          helperText={error && "Incorrect Login/password"}
          fullWidth
        ></TextField>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="primary" onClick={handleRegisterButtonClick}>
          Register
        </Button>
        <Button color="primary" onClick={handleLoginButtonClick}>
          Login
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default Login;
