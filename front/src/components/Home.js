import { AppBar, Toolbar } from "@material-ui/core";
import { AddIcon, DataGrid } from "@material-ui/data-grid";
import CachedIcon from "@material-ui/icons/Cached";
import DeleteIcon from '@material-ui/icons/Delete';
import { format, isValid, parseISO } from "date-fns";
import fetch from "node-fetch";
import React, { useEffect, useState } from "react";
import Add from "./Add";
import "./Home.css";
import logo from "../assets/bitcoinlogo.svg";

const Home = () => {
  const [trades, setTrades] = useState([]);
  const [totals, setTotals] = useState([]);
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(0);

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
        return (
          a.row.id &&
            <DeleteIcon onClick={() => deleteRow(a.row.id)} />
        );
      },
    },
  ];

  const deleteRow = async (id) => {
    try {
      const res = await fetch("/api/" + id, {
        method: "delete",
      });
      getTrades();
    } catch (err) {
      console.log(err);
    }
  };

  const getRate = async () => {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/depth?symbol=BTCEUR&limit=5"
      );
      const data = await res.json();
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
          benefit: (d.btc * rate) - d.amount
        };
      })
    );
  };

  const getTrades = async () => {
    try {
      const res = await fetch("/api");
      const data = await res.json();
      mapData(data.rows);
    } catch (err) {
      console.log(err);
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
  }

  useEffect(() => {
    if (!trades.length) {
      getTrades();
    } else {
      mapData(trades);
    }
  }, [rate]);

  useEffect(() => {
    getRate();
  }, []);

  return (
    <div className="Home">
      <Add open={open} onClose={onCloseAddHandler} />
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>Welcome to Bitcoin</h2>
      </div>
      <div className={"glow"}>
        <AppBar position="static">
          <Toolbar>
            <AddIcon onClick={() => setOpen(true)} />
            <div className={"grow"}>
              Current Rate: {rate}
            </div>
            <CachedIcon onClick={getRate} />
          </Toolbar>
        </AppBar>
      </div>
      <DataGrid autoHeight rows={trades.concat(totals)} columns={columns} />
      <ul className="Home-resources">
        <li>
          <a href="https://github.com/jaredpalmer/razzle">Docs</a>
        </li>
        <li>
          <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
        </li>
        <li>
          <a href="https://palmer.chat">Community Slack</a>
        </li>
      </ul>
    </div>
  );
};

export default Home;
