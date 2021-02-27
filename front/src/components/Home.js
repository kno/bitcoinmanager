import { AppBar, Toolbar } from "@material-ui/core";
import { AddIcon, DataGrid } from "@material-ui/data-grid";
import CachedIcon from "@material-ui/icons/Cached";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import logo from "../assets/bitcoinlogo.svg";
import Add from "./Add";
import "./Home.css";
import Login from "./Login";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Home = () => {
  const [trades, setTrades] = useState([]);
  const [totals, setTotals] = useState([]);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rate, setRate] = useState(0);
  const [password, setPassword] = useState();

  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "rate", headerName: "Buy Rate", width: 130 },
    { field: "btc", headerName: "BTC", width: 150 },
    { field: "value", headerName: "Current Value", width: 150 },
    { field: "benefit", headerName: "Benefit", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (a) => {
        return a.row.id && <DeleteIcon onClick={() => deleteRow(a.row.id)} />;
      },
    },
  ];

  const deleteRow = async (id) => {
    try {
      const res = await axios.delete("/api/" + id, {
        headers: {
          Authorization: password,
        },
      });
      getTrades();
    } catch (err) {
      console.log(err);
    }
  };

  const getRate = async () => {
    try {
      const res = await axios.get(
        "https://api.binance.com/api/v3/depth?symbol=BTCEUR&limit=5"
      );
      const data = await res.data;
      setRate(data.bids[0][0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mapData = (data) => {
    setTrades(
      data.map((d) => {
        const parsedDate = parseISO(d.date);
        return {
          ...d,
          date: isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy") : d.date,
          value: d.btc * rate,
          benefit: d.btc * rate - d.amount,
        };
      })
    );
  };

  const getTrades = async () => {
    try {
      if (!password) {
        return setShowLogin(true);
      }
      const res = await axios.get("/api", {
        headers: {
          Authorization: password,
        },
      });
      if (res) {
        const data = res.data;
        mapData(data.rows);
        setShowLogin(false);
      } else {
        console.log("res", res);
      }
    } catch (error) {
      if (error.response.status === 401) {
        setShowLogin(true);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    setTotals({
      id: 0,
      amount: trades.reduce((a, b) => a + b.amount, 0),
      btc: trades.reduce((a, b) => a + b.btc, 0),
      value: trades.reduce((a, b) => a + b.value, 0),
      benefit: trades.reduce((a, b) => a + b.benefit, 0),
    });
  }, [trades]);

  const onCloseAddHandler = () => {
    setOpen(false);
    getTrades();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const password = localStorage.getItem("password");
      if (password) {
        setPassword(password);
        setShowLogin(false);
      }
    }
    getRate();
  }, []);

  useEffect(() => {
    if (!trades.length) {
      getTrades();
    } else {
      mapData(trades);
    }
  }, [rate]);

  useEffect(() => {
    getTrades();
  }, [password]);

  const onLoginHandler = (password) => {
    setPassword(password);
    setShowLogin(false);
  };

  const logout = () => {
    localStorage.removeItem("password");
    setPassword();
    setTrades([]);
      };

  return (
    <div className="Home">
      <Login open={showLogin} onClose={getTrades} onLogin={onLoginHandler} />
      <Add open={open} onClose={onCloseAddHandler} password={password} />
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>Welcome to Bitcoin</h2>
      </div>
      <div className={"glow"}>
        <AppBar position="static">
          <Toolbar>
            <AddIcon onClick={() => setOpen(true)} />
            <div className={"grow"}>
              Current Rate: {rate} &nbsp;
              <CachedIcon onClick={getRate} />
            </div>
            <ExitToAppIcon onClick={logout} />
          </Toolbar>
        </AppBar>
      </div>
      <DataGrid autoHeight rows={trades.concat(totals)} columns={columns} />
      <ul className="Home-resources"></ul>
    </div>
  );
};

export default Home;
