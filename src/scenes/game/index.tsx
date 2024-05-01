import { Route, Routes } from "react-router-dom";
import View from "./View";
import EditGame from "./Edit";

export default function Game() {
  return (
    <Routes>
      <Route path=":id" element={<View />} />
      <Route path=":id/edit" element={<EditGame />} />
    </Routes>
  );
}
