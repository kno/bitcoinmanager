import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { useContext } from "react";
import { deleteRow } from "../services/trades";
import { Context } from "../store";

const DesktopList = ({ trades }) => {
  const { state, dispatch } = useContext(Context);
  const { rate, token, password } = state || {};

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
        return a.row.id && <DeleteIcon onClick={() => deleteRow({id: a.row.id, token, password, rate, dispatch})} />;
      },
    },
  ];

  return <DataGrid autoHeight rows={trades} columns={columns} />;
};

export default DesktopList;
