import DateFnsUtils from "@date-io/date-fns";
import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import axios from "axios";
import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import React, { useState } from "react";
import { cryptTrade } from "../crypt";
import "./Add.scss";

const Add = ({ open, onClose, loginData }) => {
  const [newData, setNewData] = useState({
    date: new Date(),
  });

  const handleDateChange = (date) => {
    setNewData({
      ...newData,
      date: date,
    });
  };

  const handleAmountChange = (event) => {
    setNewData({
      ...newData,
      amount: event.target.value,
      btc: event.target.value / newData.rate,
    });
  };

  const handleExchangeChange = (event) => {
    setNewData({
      ...newData,
      rate: event.target.value,
      btc: newData.amount / event.target.value,
    });
  };

  const handleAddButtonClick = async () => {
    try {
      const cryptedTrade = cryptTrade({
        ...newData,
        date: format(newData.date, "yyyy-MM-dd HH-mm-ss"),
      }, loginData.password);
      const res = await axios.post(
        "/api",
        JSON.stringify(cryptedTrade),
        {
          headers: {
            Authorization: JSON.stringify(loginData),
            "Content-Type": "application/json",
          },
        }
      );
      onClose && onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open}>
      <MuiDialogTitle>
        Add New entry
        <IconButton aria-label="close" onClick={onClose} className={"close"}>
          <CloseIcon />
        </IconButton>
      </MuiDialogTitle>
      <MuiDialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={newData.date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField
          margin="dense"
          id="name"
          label="Amount"
          type="number"
          onChange={handleAmountChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="name"
          label="Exchange"
          type="number"
          onChange={handleExchangeChange}
          fullWidth
        />
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="primary" onClick={handleAddButtonClick}>
          Add
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
};

export default Add;
