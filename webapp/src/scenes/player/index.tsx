import { Route, Switch } from "wouter";
import View from "./View";

export default function Player() {
  return (
    <Switch>
      <Route path="/:id" component={View} />
    </Switch>
  );
}
