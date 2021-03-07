import {
  AppBar,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  Toolbar,
} from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { AddIcon, DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import logo from "../assets/bitcoinlogo.svg";
import { decryptTrade } from "../crypt";
import Add from "./Add";
import Graph from "./graph";
import "./Home.css";
import Login from "./Login";

const Home = () => {
  const [trades, setTrades] = useState([]);
  const [totals, setTotals] = useState([]);
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rate, setRate] = useState(0);
  const [token, setToken] = useState();
  const [password, setPassword] = useState();
  const [paused, setPaused] = useState(false);
  const [showGraph, setShowGrap] = useState(false);

  const { lastMessage } = useWebSocket(
    "wss://stream.binance.com:9443/ws/btceur@depth",
    {
      share: true,
    }
  );

  useEffect(() => {
    if (!paused) {
      if (lastMessage) {
        const parsedMessage = JSON.parse(lastMessage.data);
        parsedMessage?.a &&
          parsedMessage.a[0] &&
          setRate(parseFloat(parsedMessage.a[0][0]));
      }
    }
  }, [lastMessage]);

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
          Authorization: `Bearer ${token}`,
        },
      });
      getTrades();
    } catch (err) {
      console.error(err);
    }
  };

  const mapData = (data) => {
    setTrades(
      data.map((d) => {
        return {
          ...d,
          value: d.btc * rate,
          benefit: d.btc * rate - d.amount,
        };
      })
    );
  };

  const getTrades = async () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await axios.get("/api", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res) {
        const data = res.data.rows.map((d) => {
          const decriptedTrade = decryptTrade(d, password);
          const parsedDate = parseISO(decriptedTrade.date);
          return {
            ...decriptedTrade,
            date: isValid(parsedDate)
              ? format(parsedDate, "dd/MM/yyyy")
              : decriptedTrade.date,
            value: decriptedTrade.btc * rate,
            benefit: decriptedTrade.btc * rate - decriptedTrade.amount,
            decrypted: true,
          };
        });
        mapData(data);
        setShowLogin(false);
      } else {
        console.error(res);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("password");
        setShowLogin(true);
      }
    }
  };

  const onCloseAddHandler = () => {
    setOpen(false);
    getTrades();
  };

  const playPauseClickHandler = () => {
    setPaused(!paused);
  };

  useEffect(() => {
    setTotals({
      id: 0,
      date: "Total:",
      amount: trades.reduce((a, b) => a + b.amount, 0),
      btc: trades.reduce((a, b) => a + b.btc, 0),
      value: trades.reduce((a, b) => a + b.value, 0),
      benefit: trades.reduce((a, b) => a + b.benefit, 0),
    });
  }, [trades]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      const localPassword = localStorage.getItem("password");
      if (localToken && localPassword) {
        setToken(localToken);
        setPassword(localPassword);
        setShowLogin(false);
        getTrades();
      }
    }
  }, []);

  useEffect(() => {
    getTrades();
  }, [token]);

  useEffect(() => {
    if (trades.length > 0) {
      mapData(trades);
    }
  }, [rate]);

  const onLoginHandler = (recievedToken, recievedPassword) => {
    localStorage.setItem("token", recievedToken);
    localStorage.setItem("password", recievedPassword);
    setToken(recievedToken);
    setPassword(recievedPassword);
    setShowLogin(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("password");
    setToken();
    setTrades([]);
  };

  const showHideGraph = () => {
    setShowGrap(!showGraph);
  };

  return (
    <div className="Home">
      <Login open={showLogin} onClose={getTrades} onLogin={onLoginHandler} />
      <Add
        open={open}
        onClose={onCloseAddHandler}
        token={token}
        password={password}
      />
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>Welcome to Lincoin Manager</h2>
      </div>
      <div className={"glow"}>
        <AppBar position="static">
          <Toolbar>
            <AddIcon onClick={() => setOpen(true)} />
            <div className={"grow"}>
              Current Rate: {rate} &nbsp;
              {paused ? (
                <PlayArrowIcon onClick={playPauseClickHandler} />
              ) : (
                !paused && <PauseIcon onClick={playPauseClickHandler} />
              )}
            </div>
            <ExitToAppIcon onClick={logout} />
          </Toolbar>
        </AppBar>
      </div>
      <Hidden smDown>
        {trades && trades.length && (
          <DataGrid autoHeight rows={trades.concat(totals)} columns={columns} />
        )}
      </Hidden>
      <Hidden mdUp>
        {trades && trades.length && (
          <List>
            {trades.concat(totals).map((trade) => (
              <>
                <ListItem key={trade.id}>
                  <Grid container spacing={3}>
                    <Grid item sm={6}>
                      <List>
                        <ListItem>
                          {trade.date === "Total:" ? (
                            <strong>Total</strong>
                          ) : (
                            <>
                              <strong>Date:</strong> {trade.date}
                            </>
                          )}
                        </ListItem>
                        <ListItem>
                          <strong>Amount:</strong> {trade.amount}€
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item sm={6}>
                      <List>
                        <ListItem>
                          <strong>Value:</strong> {trade.value.toFixed(2)}€
                        </ListItem>
                        <ListItem>
                          <strong>Benefit:</strong> {trade.benefit.toFixed(2)}€
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                  <ListItemSecondaryAction>
                    <DeleteIcon onClick={() => deleteRow(trade.id)} />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        )}
      </Hidden>
      <div className={"left"}>
        <Button
          fullWidth={false}
          variant="contained"
          color="primary"
          onClick={showHideGraph}
        >
          Show/Hide Graph
        </Button>
      </div>
      {showGraph && <Graph />}
      <ul className="Home-resources"></ul>
    </div>
  );
};

export default Home;
