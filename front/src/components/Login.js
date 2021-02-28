import { Button, Dialog, TextField } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import React, { useState } from "react";
import { crypt } from "../crypt";
import "./Login.scss";

const Login = ({ open, onClose, onLogin, error }) => {
  const [loginData, setLoginData] = useState({});

  const handleLoginButtonClick = () => {
    const loginToSend = {
      ...loginData,
      password: crypt(loginData.username, loginData.password)
    }
    localStorage.setItem("loginData", JSON.stringify(loginToSend));
    onLogin(loginToSend);
  };

  const handleRegisterButtonClick = async () => {
    try {
      loginData.password = crypt(loginData.username, loginData.password);
      const res = await axios.post(
        "/api/users",
        JSON.stringify(loginData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onLogin(loginData);
    } catch (error) {
      console.log(error);
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
      <MuiDialogTitle>
        Login
        <IconButton aria-label="close" onClick={onClose} className={"close"}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
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
