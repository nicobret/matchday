import { Route, Switch } from "wouter";
import Create from "./Create";
import Edit from "./Edit";
import View from "./View";

export default function Game() {
  return (
    <Switch>
      <Route path="/create" component={Create} />
      <Route path="/:id" nest>
        <Route path="/edit" component={Edit} />
        <Route path="/" component={View} />
      </Route>
    </Switch>
  );
}
