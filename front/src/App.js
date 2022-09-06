import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Store from "./store";

const App = () => (
  <Store>
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </Store>
);

export default App;
