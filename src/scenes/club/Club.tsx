import { Route } from "wouter";
import EditClub from "./Edit";
import View from "./View";

export default function Club() {
  return (
    <>
      <Route path="/edit" component={EditClub} />
      <Route path="/" component={View} />
    </>
  );
}
