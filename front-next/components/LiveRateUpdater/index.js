import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { UPDATE_RATE } from "../../store/actions";
import useAppContext from "../../store";

const LiveRateUpdater = ({ exchangeKey }) => {
  const { state, dispatch } = useAppContext()
  const { rates } = state || {};

  const [paused, setPaused] = useState(false);

  const { lastMessage } = ""/* useWebSocket(
    `wss://stream.binance.com:9443/ws/${exchangeKey}@depth`,
    {
      share: true,
    }
  ); */

  useEffect(() => {
    if (lastMessage && !paused) {
      const parsedMessage = JSON.parse(lastMessage.data);
      // parsedMessage?.a &&
      //   parsedMessage.a[0] &&
      //   dispatch({
      //     type: UPDATE_RATE,
      //     payload: {
      //       exchangeKey: exchangeKey,
      //       rate: parseFloat(parsedMessage.a[0][0])
      //     },
      //   });
    }
    return () => {
      //cleanup
    };
  }, [lastMessage]);

  const playPauseClickHandler = () => {
    setPaused(!paused);
  };

  return (
    <>
      {rates && rates[exchangeKey]}
      &nbsp;
      {paused ? (
        <PlayArrowIcon onClick={playPauseClickHandler} />
      ) : (
        !paused && <PauseIcon onClick={playPauseClickHandler} />
      )}
    </>
  );
};

export default LiveRateUpdater;
