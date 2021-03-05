import axios from "axios";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Graph = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    const results = await axios.get("/api/exchange/BTC-EUR");
    results.data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const newData = results.data.map((value, i) => {
      return {
        name: format(parseISO(value.date), "dd/MM/yyyy"),
        btc: value.open || value.close,
      };
    });
    setData(newData);
  }, []);

  return data.length > 0 && (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="btc"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default Graph;
