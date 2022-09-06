import axios from "axios";
import { compareAsc, format, isValid, parse, parseISO } from "date-fns";
import { decryptTrade } from "./crypt";
import { FETCH_TRADES } from "../store/actions";

export const getTrades = async ({ token, password, rate, dispatch }) => {
  const fetchedTrades = await fetchTrades({
    token: token,
    password: password,
    rate: rate,
  });
  if (fetchedTrades) {
    dispatch({
      type: FETCH_TRADES,
      payload: fetchedTrades,
    });
  }
};

export const deleteRow = async ({ id, token, password, rates, dispatch }) => {
  try {
    const res = await axios.delete("/api/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    getTrades({ token, password, rate: rates, dispatch });
  } catch (err) {
    console.error(err);
  }
};
const parseDate = (d) => parse(d.date, "dd/MM/yyyy", new Date());
const compareDates = (a, b) => compareAsc(parseDate(a), parseDate(b));

const fetchTrades = async ({ token, password, rates }) => {
  if (!token) {
    return;
  }
  try {
    const res = await axios.get("/api", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res) {
      const trades = res.data.rows.map((trade) => {
        const decriptedTrade = decryptTrade(trade, password);
        const parsedDate = parseISO(decriptedTrade.date);
        return {
          ...decriptedTrade,
          date: isValid(parsedDate)
            ? format(parsedDate, "dd/MM/yyyy")
            : decriptedTrade.date,
          value: decriptedTrade.btc * rates,
          benefit: decriptedTrade.btc * rates - decriptedTrade.amount,
          decrypted: true,
        };
      });
      return trades.sort(compareDates);
    } else {
      console.error(res);
      return { error: true };
    }
  } catch (error) {
    console.error(error);
    if (error?.response?.status === 401) {
      return { error: true };
    }
  }
};

const mapTrades = ({ trades = [], rate }) => {
  return trades.map((trade) => {
    return {
      ...trade,
      value: trade.btc * rate,
      benefit: trade.btc * rate - trade.amount,
    };
  });
};

export { fetchTrades, mapTrades };
