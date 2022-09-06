import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useContext } from "react";
import NumberFormat from "react-number-format";
import { deleteRow } from "../services/trades";
import { Context } from "../store";

const DesktopList = ({ trades }) => {
  const { state, dispatch } = useContext(Context);
  const { rate, token, password } = state || {};

  const FormatNumber = (num, decimals = 2) => (
    <NumberFormat
      value={num}
      displayType={"text"}
      decimalScale={decimals}
      suffix={"€"}
    />
  );

  const columns = [
    { field: "date", headerName: "Date", width: 130 },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
      renderCell: (a) => FormatNumber(a.value),
    },
    {
      field: "rate",
      headerName: "Buy Rate",
      width: 100,
      renderCell: (a) => FormatNumber(a.value),
    },
    { field: "coin", headerName: "Coin", width: 100 },
    { field: "btc", headerName: "BTC", width: 200 },
    {
      field: "value",
      type: "number",
      headerName: "Current Value",
      width: 150,
      renderCell: (a) => FormatNumber(a.value),
    },
    {
      field: "benefit",
      headerName: "Benefit",
      width: 100,
      renderCell: (a) => FormatNumber(a.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (a) => {
        return (
          a.row.id && (
            <DeleteIcon
              onClick={() =>
                deleteRow({ id: a.row.id, token, password, rate, dispatch })
              }
            />
          )
        );
      },
    },
  ];

  return <DataGrid autoHeight rows={trades} columns={columns} />;
};

export default DesktopList;
