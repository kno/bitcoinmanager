import { AppBar, Button, Toolbar } from "@material-ui/core"
import Hidden from "@material-ui/core/Hidden"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import React, { useEffect, useState } from "react"
import logo from "../../assets/bitcoinlogo.svg"
import { getTrades, mapTrades } from "../../services/trades"
import { FETCH_TRADES, SET_USER_DATA } from "../../store/actions"
import Add from "../Add"
import DesktopList from "../DesktopList"
// import Graph from "./graph"
import Image from "next/image"
import useAppContext from "../../store"
import LiveRateUpdater from "../LiveRateUpdater"
import Login from "../Login"
import MobileList from "../MobileList"
import "./Home.module.scss"

const Home = () => {
  const { state, dispatch } = useAppContext()
  console.log('state', state)
  const { trades = [], rates, token, password } = state || {}

  const [totals, setTotals] = useState([])
  const [isOpenAddDialog, setOpenAddDialog] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showGraph, setShowGrap] = useState(false)

  useEffect(() => {
    if (token && password) {
      getTrades({ token, password, rates, dispatch })
    }
  }, [token, password])
  /*
    useEffect(() => {
      if (trades && trades.length > 0) {
        // const mappedTrades = mapTrades({ trades: trades, rate: rates['btceur'] })
        // dispatch({
        //   type: FETCH_TRADES,
        //   payload: mappedTrades,
        // })
      }
    }, [rates])
   */
  useEffect(() => {
    console.log("useEffect home")
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token")
      const localPassword = localStorage.getItem("password")
      console.log(`LT: ${localToken} LP: ${localPassword} T:${token} P:${password}`)
      if (localToken && localPassword && localToken !== token && localPassword !== password) {
        console.log('dispatch')
        dispatch({
          password: localPassword,
          token: localToken,
        })
      } else {
        setShowLogin(true)
      }
    }
  }, [])

  const onCloseAddHandler = () => {
    setOpenAddDialog(false)
    // getTrades({ token, password, rates, dispatch })
  }
  /*
    useEffect(() => {
      setTotals({
        id: 0,
        date: "Total:",
        amount: trades?.reduce((a, b) => a + b.amount, 0),
        btc: trades?.reduce((a, b) => a + b.btc, 0),
        value: trades?.reduce((a, b) => a + b.value, 0),
        benefit: trades?.reduce((a, b) => a + b.benefit, 0),
      })
    }, [trades]) */

  const onLoginHandler = (recievedToken, recievedPassword) => {
    if (recievedToken && recievedPassword) {
      localStorage.setItem("token", recievedToken)
      localStorage.setItem("password", recievedPassword)
      // dispatch({
      //   type: SET_USER_DATA,
      //   payload: {
      //     password: recievedPassword,
      //     token: recievedToken,
      //   },
      // })
      setShowLogin(false)
      getTrades({ token, password, rates, dispatch })
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("password")
    // dispatch({
    //   type: SET_USER_DATA,
    //   payload: {
    //     password: "",
    //     token: "",
    //   },
    // })
    // dispatch({
    //   type: FETCH_TRADES,
    //   payload: [],
    // })
    setShowLogin(true)
  }

  const showHideGraph = () => {
    setShowGrap(!showGraph)
  }

  return (
    <div className="Home">
      <Login open={showLogin} onLogin={onLoginHandler} />
      <Add
        open={isOpenAddDialog}
        onClose={onCloseAddHandler}
        token={token}
        password={password}
      />
      <div className="Home-header">
        <Image
          src={logo}
          width="80"
          height="80"
        />
        <h2>Welcome to Lincoin Manager</h2>
      </div>
      <div className="glow">
        <AppBar position="static">
          <Toolbar>
            {/* <AddIcon onClick={() => setOpenAddDialog(true)} /> */}
            <div className="grow">
              Current Rate:
              <LiveRateUpdater exchangeKey="btceur" />
            </div>
            <ExitToAppIcon onClick={logout} />
          </Toolbar>
        </AppBar>
      </div>
      {trades && trades.length > 0 ? (
        <>
          <Hidden smDown>
            <div>
              <DesktopList trades={trades.concat(totals)} />
            </div>
          </Hidden>
          <Hidden mdUp>
            <MobileList trades={trades.concat(totals)} />
          </Hidden>
        </>
      ) : (
        <div>No trades to list</div>
      )}
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
      {/* {showGraph && <Graph />} */}
      <ul className="Home-resources"></ul>
    </div>
  )
}

export default Home
