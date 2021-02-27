import { Button, Dialog, TextField } from "@material-ui/core";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import "./Login.scss";

const Login = ({ open, onClose, onLogin }) => {
  const [password, setPassword] = useState();

  const handleLoginButtonClick = () => {
    onLogin(password);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (typeof window !== "undefined") {
      const password = localStorage.setItem("password", event.target.value);
    }
  };
  const handlePasswordKeyPress = (event) => {
    if (event.key === "Enter") {
      onLogin(password);
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
          label="Secret Password"
          onChange={handlePasswordChange}
          onKeyPress={handlePasswordKeyPress}
          autoFocus
        ></TextField>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="primary" onClick={handleLoginButtonClick}>
          Login
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default Login;
