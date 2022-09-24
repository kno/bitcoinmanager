import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { deleteRow } from "../../services/trades";
import useAppContext from "../../store";

const MobileListItem = ({ trade }) => {
  const { state, dispatch } = useAppContext()
  const { rate, token, password } = state || {};

  const handleDeleteButtonClick = (id) => {
    deleteRow({ id, token, password, rate, dispatch });
  };

  return (
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
          <DeleteIcon onClick={() => handleDeleteButtonClick(trade.id)} />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

const MobileList = ({ trades }) => {
  return (
    <List>
      {trades.map((trade) => (
        <MobileListItem key={trade.id} trade={trade} />
      ))}
    </List>
  );
};

export default MobileList;
